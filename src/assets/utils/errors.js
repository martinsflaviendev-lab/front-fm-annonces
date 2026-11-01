export const getErrorMessage = (error) => {
  if (!error.response) return 'Connexion impossible, réessayez plus tard'
  switch (error.response.status) {
    case 400:
      return 'Requête invalide'
    case 401:
      return 'Veuillez vous reconnecter'
    case 403:
      return "Vous n'avez pas le droit de faire cela"
    case 404:
      return 'Élément introuvable'
    default:
      return 'Une erreur est survenue, réessayez plus tard'
  }
}
