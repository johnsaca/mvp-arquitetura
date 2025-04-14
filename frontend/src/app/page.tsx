"use client";
import React, { useEffect, useState } from "react";
import { getTop20Pokemon, Pokemon } from "@/services/poke-api";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
              <AlertDialogAction onClick={() => onRemove(pokemon.id)}>
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
  // TODO: Implement this by calling the Flask Python CRUD API.
  console.log("Sending pokemon to local API", pokemon);
  // For now, we just return true to simulate a successful transfer.
  return true;
}

export default function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [pokeDeck, setPokeDeck] = useState<Pokemon[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    async function fetchPokemon() {
      setIsLoading(true);
      const pokemon = await getTop20Pokemon();
      setPokemonList(pokemon);
      setIsLoading(false);
    }

    fetchPokemon();
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

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Top 20 Pokemon</h2>
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Your PokeDeck</h2>
        </div>
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
