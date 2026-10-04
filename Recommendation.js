import { distanceKm } from '../nusajoy/src/hooks/useGeolocation'

/**
 * Menghitung skor rekomendasi pemandu wisata
 * berdasarkan kategori, budget, jarak, dan rating.
 */
export const getRecommendedGuides = (
  guides = [],
  preferences = {},
  userLocation = null
) => {
  return guides
    .map((guide) => {
      let score = 0
      let dist = null

      const category = preferences.category || 'Semua'
      const maxBudget = Number(preferences.maxBudget) || 0

      const guidePrice = Number(guide.price_per_day) || 0
      const guideRating = Number(guide.rating) || 0

      const guideLat = Number(guide.latitude)
      const guideLng = Number(guide.longitude)

      // ==========================================
      // 1. KATEGORI — 30%
      // ==========================================
      if (
        category !== 'Semua' &&
        guide.category &&
        guide.category.toLowerCase() === category.toLowerCase()
      ) {
        score += 30
      }

      // ==========================================
      // 2. BUDGET — 25%
      // ==========================================
      if (maxBudget > 0 && guidePrice > 0) {
        if (guidePrice <= maxBudget) {
          score += 25
        } else if (guidePrice <= maxBudget * 1.2) {
          score += 15
        } else if (guidePrice <= maxBudget * 1.5) {
          score += 5
        }
      }

      // ==========================================
      // 3. JARAK — 25%
      // ==========================================
      if (
        userLocation &&
        userLocation.lat !== null &&
        userLocation.lat !== undefined &&
        userLocation.lng !== null &&
        userLocation.lng !== undefined &&
        Number.isFinite(guideLat) &&
        Number.isFinite(guideLng)
      ) {
        dist = distanceKm(
          Number(userLocation.lat),
          Number(userLocation.lng),
          guideLat,
          guideLng
        )

        if (dist !== null) {
          if (dist <= 10) {
            score += 25
          } else if (dist <= 30) {
            score += 15
          } else if (dist <= 50) {
            score += 5
          }
        }
      }

      // ==========================================
      // 4. RATING — 20%
      // ==========================================
      if (guideRating > 0) {
        const ratingScore = Math.min(guideRating, 5) / 5 * 20
        score += ratingScore
      }

      return {
        ...guide,
        distanceKm: dist,
        matchScore: Math.round(score),
      }
    })
    .sort((a, b) => {
      // Skor tertinggi di atas
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore
      }

      // Jika skor sama, rating lebih tinggi di atas
      return (Number(b.rating) || 0) - (Number(a.rating) || 0)
    })
}