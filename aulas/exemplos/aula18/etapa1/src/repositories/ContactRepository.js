const contacts = [
  { id: 'ana', name: 'Ana Souza' },
  { id: 'bruno', name: 'Bruno Lima' },
  { id: 'carla', name: 'Carla Dias' },
];

export class ContactRepository {
  list(excludeId) {
    return contacts.filter((c) => c.id !== excludeId);
  }

  getById(id) {
    return contacts.find((c) => c.id === id);
  }
}
