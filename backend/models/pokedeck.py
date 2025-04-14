from sqlalchemy import Column, String, Integer, DateTime, Float, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from typing import Union

from  models import Base


class Pokemon(Base):

    __tablename__ = 'poke_deck'

    id = Column("pk_pokemon", Integer, primary_key=True)

    nome = Column(String(140))
    idpkm = Column(Integer)
    altura = Column(Float)
    peso = Column(Float)
    tipo = Column(String(140))
    imageurl = Column(String(140))

    data_insercao = Column(DateTime, default=datetime.now())

    __table_args__ = (UniqueConstraint("nome", "idpkm", name="pokemon_unique_id"),)


    def __init__(self, nome, idpkm, altura, peso, tipo, imageurl,
                 data_insercao:Union[DateTime, None] = None):
        """
        Captura de Pokemon

        Arguments:
            nome: nome do Pokemon.
            idpkm: id original da pokedeck
            altura: altura do Pokemon
            peso: peso do Pokemon
            tipo: tipo do Pokemon
            imageurl: url da imagem do Pokemon
            data_insercao: data de quando o Pokemon foi capturado
        """
        self.nome = nome
        self.idpkm = idpkm
        self.altura = altura
        self.peso = peso
        self.tipo = tipo
        self.imageurl = imageurl

        if data_insercao:
            self.data_insercao = data_insercao

    def to_dict(self):
        """
        Retorna a representação em dicionário do Objeto pokemon.
        """
        return{
            "id": self.id,
            "nome": self.nome,
            "idpkm": self.idpkm,
            "altura": self.altura,
            "peso": self.peso,
            "tipo": self.tipo,
            "imageurl": self.imageurl,
            "data_insercao": self.data_insercao,
        }

    def __repr__(self):
        """
        Retorna uma representação do pokemon em forma de texto.
        """
        return f"pokemon(id={self.id}, nome='{self.nome}', idpkm={self.idpkm}, altura={self.altura}, peso={self.peso}, tipo='{self.tipo}', imageurl='{self.imageurl}'"
