import { JOKE_TYPE } from "@/components/DataTagger";

interface Joke {
  joke: string;
}

const API_SWITCH_CUT_OFF = 0.5;

export async function fetchDadJoke() {
  const response = await fetch("https://api.api-ninjas.com/v1/dadjokes", {
    headers: {
      "X-Api-Key": process.env.NEXT_PUBLIC_JOKE_API,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch joke");
  }
  const data = (await response.json()) as Joke[];
  return data[0];
}

async function fetchMamaJoke() {
  const response = await fetch(
    "https://cors-anywhere.herokuapp.com/https://www.yomama-jokes.com/api/v1/jokes/random",
    {}
  );

  if (!response.ok) {
    throw new Error("Failed to fetch joke");
  }
  return await response.json();
}

export async function getRandomJoke(value: number) {
  if (value > API_SWITCH_CUT_OFF) {
    return await fetchDadJoke();
  }
  return await fetchMamaJoke();
}

export function validateTag(tag: string, input: number): boolean {
  if (input > API_SWITCH_CUT_OFF && tag === JOKE_TYPE.DAD) {
    return true;
  }

  if (input <= API_SWITCH_CUT_OFF && tag === JOKE_TYPE.MAMA) {
    return true;
  }

  return false;
}

export function convertPointsToWei(points: number): string {
  const weiPerPoint = 10000000; // 1 gwei per 10 points
  return (points * weiPerPoint).toString();
}
