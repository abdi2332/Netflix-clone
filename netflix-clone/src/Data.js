export const API_KEY='714a32efca66b7fa64a096c1e0fa32d6'
export const random=()=>{
    return Math.floor(Math.random() * 21)
}
export function convertToHours(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes} min`;
  }