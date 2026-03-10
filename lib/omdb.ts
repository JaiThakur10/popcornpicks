export async function searchMovies(query: string) {
  const res = await fetch(
    `https://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&s=${query}`,
  );

  const data = await res.json();

  return data.Search || [];
}
