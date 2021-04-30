import React, { useState, useEffect } from 'react';
import {useQuery} from '@apollo/react-hooks';
import {useMutation} from '@apollo/react-hooks';
import {GET_ME} from '../utils/queries';
import {REMOVE_BOOK} from '../utils/mutations';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // const [userData, setUserData] = useState({});

  const {loading, data: userData} = useQuery(GET_ME);
  const [removeBook, {error}] = useMutation(REMOVE_BOOK);

  const loggedIn = Auth.loggedIn();
  const savedBooks = userData?.me.savedBooks || [];
  // console.log(savedBooks);

  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      await removeBook({
        variables: {bookId}
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {!loading && userData.me.savedBooks.length
            ? `Viewing ${userData.me.savedBooks.length} saved ${userData.me.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'
          }
        </h2>
        <CardColumns>
          {!loading && userData.me.savedBooks.map((book) => {
              return (
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              );
            })
          }
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
