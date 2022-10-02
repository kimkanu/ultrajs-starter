import { tw } from "twind";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

interface Book {
  id: number;
  title: string;
}

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <main className={tw`w-full h-full`}>
    <div className={tw`w-full h-full flex flex-col justify-center items-center`}>
      {children}
    </div>
  </main>
);

const BookList: FunctionComponent<{ version: number }> = ({ version }) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch("/api/books", {
          signal: abortController.signal,
        });
        const newData = await response.json();
        setBooks(newData);
      } catch (error) {
        if (error.name === "AbortError") {
          console.info("The request to /books was aborted!");
        }
      }
    };
    fetchData();

    return () => {
      abortController.abort();
    };
  }, [version]);

  return (
    <ul>
      {books.map((li) => <li key={li.id}>{li.title}</li>)}
    </ul>
  );
};

const HomePage: FunctionComponent = () => {
  const [version, setVersion] = useState(0);

  const invalidate = () => setVersion((v) => v + 1);
  return (
    <Layout>
      <BookList version={version} />
      <hr />
      <button
        onClick={async () => {
          await fetch("/api/books", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: "The Hobbit",
            }),
          });
          invalidate();
        }}
      >
        Add a book
      </button>
    </Layout>
  );
};

export default HomePage;
