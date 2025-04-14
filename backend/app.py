from flask_openapi3 import OpenAPI, Info, Tag
from flask import redirect
from urllib.parse import unquote
from sqlalchemy.exc import IntegrityError
from models import Session, Pokemon
from logger import logger
from schemas import *
from flask_cors import CORS

info = Info(title="API PokeDeck", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)

home_tag = Tag(name="Documentação", description="Seleção de documentação: Swagger")
pokemon_tag = Tag(name="PokeDeck", description="Adição, visualização e remoção de Pokemon a PokeDeck")

@app.get('/', tags=[home_tag])
def home():
    """Redireciona para /openapi, tela que permite a escolha do estilo de documentação."""
    return redirect('/openapi')

@app.post('/pokemon', tags=[pokemon_tag],
          responses={"200": PokemonViewSchema, "409": ErrorSchema, "400": ErrorSchema})
def add_pokemon(form: PokemonSchema):
    """Adiciona um novo Pokemon a PokeDeck
    Retorna uma representação da PokeDeck.
    """
    print(form)
    pokemon = Pokemon(
        nome=form.nome,
        idpkm=form.idpkm,
        altura=form.altura,
        peso=form.peso,
        tipo=form.tipo,
        imageurl=form.imageurl
    )
    logger.info(f"Adicionando pokemon de nome: '{pokemon.nome}'")
    try:
        session = Session()
        session.add(pokemon)
        session.commit()
        logger.info("Adicionado pokemon: %s" % pokemon)
        return apresenta_pokemons(pokemon), 200
    except IntegrityError as e:
        error_msg = "Você já possui esse Pokemon"
        logger.warning(f"Erro ao capturar Pokemon '{pokemon.nome}', {error_msg}")
        return {"message": error_msg}, 409
    except Exception as e:
        error_msg = "Não foi possível salvar novo investimento"
        logger.warning(f"Erro ao adicionar ação '{pokemon.nome}', {error_msg}")
        return {"message": error_msg}, 400

@app.get('/pokemons', tags=[pokemon_tag],
         responses={"200": ListagemPokemonSchema, "404": ErrorSchema})
def get_pokemons():
    """Faz a busca por todos os Pokemons cadastrados
    Retorna uma representação da PokeDeck.
    """
    logger.info(f"Coletando Pokemon")
    session = Session()
    pokemons = session.query(Pokemon).all()
    if not pokemons:
        return {"PokeDeck": []}, 200
    else:
        logger.info(f"%d Pokemon coletado" % len(pokemons))
        return apresenta_pokemons(pokemons), 200

@app.get('/pokemon', tags=[pokemon_tag],
         responses={"200": PokemonViewSchema, "404": ErrorSchema})
def get_pokemon(query: PokemonBuscaPorIDSchema):
    """Faz a busca por um Pokemon a partir do id
    Retorna uma representação do Pokemon.
    """
    pokemon_id = query.id
    logger.info(f"Coletando dados sobre o Pokemon #{pokemon_id}")
    session = Session()
    pokemon = session.query(Pokemon).filter(Pokemon.id == pokemon_id).first()
    if not pokemon:
        error_msg = "Pokemon ainda não capturado"
        logger.warning(f"Erro ao buscar Pokemon '{pokemon_id}', {error_msg}")
        return {"message": error_msg}, 404
    else:
        logger.info("Pokemon encontrado: %s" % pokemon)
        return apresenta_pokemons(pokemon), 200

@app.delete('/pokemon', tags=[pokemon_tag],
            responses={"200": PokemonDelSchema, "404": ErrorSchema})
def del_pokemon(query: PokemonBuscaPorIDSchema):
    """Deleta um Pokemon a partir do id informado
    Retorna uma mensagem de confirmação da remoção.
    """
    pokemon_id = query.id  # Use 'id' em vez de 'nome'
    logger.info(f"Deletando dados sobre Pokemon #{pokemon_id}")
    session = Session()
    count = session.query(Pokemon).filter(Pokemon.id == pokemon_id).delete()
    session.commit()
    if count:
        logger.info(f"Deletado o Pokemon #{pokemon_id} da PokeDeck")
        return {"message": "Pokemon removido", "id": pokemon_id}
    else:
        error_msg = "Pokemon não encontrado na PokeDeck"
        logger.warning(f"Erro ao deletar Pokemon #'{pokemon_id}', {error_msg}")
        return {"message": error_msg}, 404

@app.get('/busca_pokemon', tags=[pokemon_tag],
         responses={"200": ListagemPokemonSchema, "404": ErrorSchema})
def busca_pokemon(query: PokemonBuscaPorNomeSchema):
    """Faz a busca por Pokemon a partir do id
    Retorna uma representação da PokeDeck.
    """
    termo = unquote(query.termo)
    logger.info(f"Fazendo a busca por Pokemon com o termo: {termo}")
    session = Session()
    pokemons = session.query(Pokemon).filter(Pokemon.nome.ilike(f"%{termo}%")).all()
    
    if not pokemons:
        return {"pokemons": []}, 200
    else:
        logger.info(f"%d Pokemon encontrados" % len(pokemons))
        return apresenta_pokemons(pokemons), 200
