export function removeDuplicatesById(array: any[]) {
    return Array.from(new Set(array.map(a => a.id)))
     .map(id => {
       return array.find(a => a.id === id)
     })
}