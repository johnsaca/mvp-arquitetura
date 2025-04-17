"use client";
import React, { useEffect, useState } from "react";
import { getTop20Pokemon } from "@/services/poke-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  type: string;
  imageUrl: string;
}

interface PokeDeckItemProps {
  pokemon: Pokemon;
  onRemove: (id: number) => void;
}

const PokeDeckItem: React.FC<PokeDeckItemProps> = ({ pokemon, onRemove }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{pokemon.name}</CardTitle>
        <CardDescription>Type: {pokemon.type}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <img src={pokemon.imageUrl} alt={pokemon.name} className="max-w-48" />
        <p>ID: {pokemon.id}</p>
        <p>Height: {pokemon.height}</p>
        <p>Weight: {pokemon.weight}</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Remove from PokeDeck</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove{" "}
                {pokemon.name} from your PokeDeck.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  const removed = await removePokemonFromPokeDeck(pokemon.id);
                  if (removed) onRemove(pokemon.id);
                }}
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

async function sendPokemonToPokeDeck(pokemon: Pokemon) {
  try {
    const response = await fetch("http://127.0.0.1:5000/pokemon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: pokemon.name,
        idpkm: pokemon.id,
        altura: pokemon.height,
        peso: pokemon.weight,
        tipo: pokemon.type,
        imageurl: pokemon.imageUrl,
      }),
    });

    return response.ok;
  } catch (err) {
    console.error("Erro ao adicionar:", err);
    return false;
  }
}

async function removePokemonFromPokeDeck(idpkm: number) {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/pokemon?idpkm=${idpkm}`,
      {
        method: "DELETE",
      }
    );

    return response.ok;
  } catch (err) {
    console.error("Erro ao remover:", err);
    return false;
  }
}

async function loadPokeDeck(): Promise<Pokemon[]> {
  try {
    const response = await fetch("http://127.0.0.1:5000/pokemons");
    if (!response.ok) return [];

    const data = await response.json();
    return data.pokemons.map((p: any) => ({
      id: p.idpkm,
      name: p.nome,
      height: p.altura,
      weight: p.peso,
      type: p.tipo,
      imageUrl: p.imageurl,
    }));
  } catch (err) {
    console.error("Erro ao carregar PokeDeck:", err);
    return [];
  }
}

async function searchPokemonByName(term: string): Promise<Pokemon[]> {
  try {
    const response = await fetch(
      `http://127.0.0.1:5000/busca_pokemon?termo=${encodeURIComponent(term)}`
    );
    if (!response.ok) return [];

    const data = await response.json();
    return data.pokemons.map((p: any) => ({
      id: p.idpkm,
      name: p.nome,
      height: p.altura,
      weight: p.peso,
      type: p.tipo,
      imageUrl: p.imageurl,
    }));
  } catch (error) {
    console.error("Erro ao buscar por nome:", error);
    return [];
  }
}

export default function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [pokeDeck, setPokeDeck] = useState<Pokemon[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const top20 = await getTop20Pokemon();
      const deck = await loadPokeDeck();
      setPokemonList(top20);
      setPokeDeck(deck);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  const handleAddToPokeDeck = async (pokemon: Pokemon) => {
    const success = await sendPokemonToPokeDeck(pokemon);
    if (success) {
      setPokeDeck([...pokeDeck, pokemon]);
      toast({
        title: "Pokemon Added!",
        description: `${pokemon.name} has been added to your PokeDeck.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add ${pokemon.name} to your PokeDeck.`,
      });
    }
  };

  const handleRemoveFromPokeDeck = (id: number) => {
    setPokeDeck(pokeDeck.filter((pokemon) => pokemon.id !== id));
    toast({
      title: "Pokemon Removed!",
      description: `Pokemon has been removed from your PokeDeck.`,
    });
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex items-center justify-center mb-6">
        <h1 className="text-4xl font-bold text-primary">PokeDeck</h1>
      </header>

      <div className="mb-6 flex items-center gap-2">
        <Input
          placeholder="Search PokeDeck..."
          onChange={async (e) => {
            const term = e.target.value;
            if (term.length >= 2) {
              const result = await searchPokemonByName(term);
              setPokeDeck(result);
            } else {
              const deck = await loadPokeDeck();
              setPokeDeck(deck);
            }
          }}
        />
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Top 20 Pokémon (API externa)
        </h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pokemonList.map((pokemon) => (
              <Card
                key={pokemon.id}
                className="hover:shadow-md transition-shadow duration-300"
              >
                <CardHeader>
                  <CardTitle>{pokemon.name}</CardTitle>
                  <CardDescription>Type: {pokemon.type}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <img
                    src={pokemon.imageUrl}
                    alt={pokemon.name}
                    className="max-w-48"
                  />
                  <p>ID: {pokemon.id}</p>
                  <p>Height: {pokemon.height}</p>
                  <p>Weight: {pokemon.weight}</p>
                  <Button onClick={() => handleAddToPokeDeck(pokemon)}>
                    Add to PokeDeck
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your PokeDeck</h2>
        {pokeDeck.length === 0 ? (
          <p>Your PokeDeck is empty.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pokeDeck.map((pokemon) => (
              <PokeDeckItem
                key={pokemon.id}
                pokemon={pokemon}
                onRemove={handleRemoveFromPokeDeck}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
