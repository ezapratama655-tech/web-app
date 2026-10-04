const FAVORITES_KEY = 'nusajoy_favorite_guides'

export const getFavorites = () => {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY)

    if (!saved) {
      return []
    }

    const parsed = JSON.parse(saved)

    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error('Gagal mengambil data favorit:', error)
    return []
  }
}

export const isFavorite = (guideId) => {
  const favorites = getFavorites()

  return favorites.some(
    (id) => String(id) === String(guideId)
  )
}

export const toggleFavorite = (guideId) => {
  const favorites = getFavorites()

  const exists = favorites.some(
    (id) => String(id) === String(guideId)
  )

  const updated = exists
    ? favorites.filter(
        (id) => String(id) !== String(guideId)
      )
    : [...favorites, guideId]

  try {
    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updated)
    )
  } catch (error) {
    console.error('Gagal menyimpan data favorit:', error)
  }

  return updated
}