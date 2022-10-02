type Book = {
  id: number;
  title: string;
};

interface State {
  books: Book[];
}

const state: State = {
  books: [],
};

export default state;
