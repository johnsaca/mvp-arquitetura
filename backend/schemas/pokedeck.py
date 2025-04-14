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
    id: int = "1"


class ListagemPokemonSchema(BaseModel):
    """ Define como uma listagem de Pokemon será retornada.
    """
    Pokemons:List[PokemonViewSchema]


def apresenta_pokemons(Pokemons: List[Pokemon]):
    """ Retorna uma representação do Pokemon seguindo o schema definido em
        ListagemPokemonSchema.
    """
    result = []
    for Pokemon in Pokemons:
        result.append({
            "id": Pokemon.id,
            "nome": Pokemon.nome,
            "idpkm": Pokemon.idpkm,
            "altura": Pokemon.altura,
            "peso": Pokemon.peso,
            "tipo": Pokemon.tipo,
            "imageurl": Pokemon.imageurl
        })

    return {"Pokemons": result}


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


def apresenta_Pokemon(Pokemon: Pokemon):
    """ Retorna uma representação da ação seguindo o schema definido em
        PokemonViewSchema.
    """
    return {
        "id": Pokemon.id,
        "nome": Pokemon.nome,
        "idpkm": Pokemon.idpkm,
        "altura": Pokemon.altura,
        "peso": Pokemon.peso,
        "tipo": Pokemon.tipo,
        "imageurl": Pokemon.imageurl
    }
