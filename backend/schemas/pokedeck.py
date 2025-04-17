from pydantic import BaseModel
from typing import Optional, List
from models.pokedeck import Pokemon


class PokemonSchema(BaseModel):
    """ Define como um novo Pokemon a ser capturado deve ser representada
    """
    nome: str = "pikachu"
    idpkm: int = 25
    altura: float = 4
    peso: float = 60
    tipo: str = "electric"
    imageurl: str = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"


class PokemonViewSchema(BaseModel):
    """ Define como um novo Pokemon a ser capturado deve ser representada
    """
    nome: str = "pikachu"
    idpkm: int = 25
    altura: float = 4
    peso: float = 60
    tipo: str = "electric"
    imageurl: str = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"


class PokemonBuscaPorNomeSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca. Que será
        feita apenas com base no nome do Pokemon.
    """
    termo: str = "pikachu"


class PokemonBuscaPorIDSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca. Que será
        feita apenas com base no ID do Pokemon.
    """
    idpkm: int


class ListagemPokemonSchema(BaseModel):
    """ Define como uma listagem de Pokemon será retornada.
    """
    pokemons:List[PokemonViewSchema]


def apresenta_pokemons(pokemons: List[Pokemon]):
    """ Retorna uma representação do Pokemon seguindo o schema definido em
        ListagemPokemonSchema.
    """
    result = []
    for pokemon in pokemons:
        result.append({
            "id": pokemon.id,
            "nome": pokemon.nome,
            "idpkm": pokemon.idpkm,
            "altura": pokemon.altura,
            "peso": pokemon.peso,
            "tipo": pokemon.tipo,
            "imageurl": pokemon.imageurl
        })

    return {"pokemons": result}


class PokemonViewSchema(BaseModel):
    """ Define como um Pokemon será retornado.
    """
    id: int = 1
    nome: str = "pikachu"
    idpkm: int = 25
    altura: float = 4
    peso: float = 60
    tipo: str = "electric"
    imageurl: str = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"


class PokemonDelSchema(BaseModel):
    """ Define como deve ser a estrutura do dado retornado após uma requisição
        de remoção.
    """
    mesage: str
    id: int


def apresenta_Pokemon(pokemon: Pokemon):
    """ Retorna uma representação da ação seguindo o schema definido em
        PokemonViewSchema.
    """
    return {
        "id": pokemon.id,
        "nome": pokemon.nome,
        "idpkm": pokemon.idpkm,
        "altura": pokemon.altura,
        "peso": pokemon.peso,
        "tipo": pokemon.tipo,
        "imageurl": pokemon.imageurl
    }
