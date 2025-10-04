export const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-green-100 text-green-800"
    case "Devotee":
      return "bg-red-100 text-red-800"
    case "Volunteer":
      return "bg-blue-100 text-blue-800"
    case "Priest":
      return "bg-purple-100 text-purple-800"
    case "Trustee":
      return "bg-orange-100 text-orange-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getStatusBadgeColor = (status: string) => {
  return status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
}
