import React, { useState, useEffect } from 'react';
import {useQuery, useMutation} from '@apollo/react-hooks';
import {GET_ME} from '../utils/queries';
import {REMOVE_BOOK} from '../utils/mutations';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { removeBookId } from '../utils/localStorage';


const SavedBooks = () => {
  const {loading, data: userData} = useQuery(GET_ME);
  const [removeBook, {error}] = useMutation(REMOVE_BOOK, {
    update(cache, {data: {removeBook}}){
      console.log(cache);
      const {me} = cache.readQuery({query: GET_ME});
      
      const newBooksData = {
        savedBooks: me.savedBooks.filter((t) => t.id !== 'SnLsDwAAQBAJ')
      }
      console.log(newBooksData);

      cache.writeQuery({
        query: GET_ME,
        data:{ me:{newBooksData}}
      })
    }
  });
  
  if(!userData){
      return null
  }

  const handleDeleteBook = async (bookId) => {
    try {
       const data = await removeBook({
        variables: {bookId},
      });
    } catch (err) {
      console.error(err);
    }
    removeBookId(bookId);
    window.location.reload(false);
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
