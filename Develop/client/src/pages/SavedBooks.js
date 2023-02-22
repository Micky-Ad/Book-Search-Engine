import React, { useState, useEffect } from "react";
import {
	Jumbotron,
	Container,
	CardColumns,
	Card,
	Button,
} from "react-bootstrap";

import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import { REMOVE_BOOK } from "../utils/mutations";


import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {

	// Mutation

	const [removeBook, { error, data }] = useMutation(REMOVE_BOOK);

	// Query
	const userRequest = useQuery(GET_ME);
	const loading = userRequest.loading;
	let userData = {
		savedBooks: []
	};

	if (userRequest.loading === false) userData = userRequest.data.me;

	let userDataLength = 0;

	if (userData !== null && userData !== undefined) {
		userDataLength = Object.keys(userData).length;
	}

	useEffect(() => {
		const getUserData = async () => {
			try {
				const token = Auth.loggedIn() ? Auth.getToken() : null;

				if (!token) {
					return false;
				}

				userRequest.refetch();

			} catch (err) {
				console.error(err);
			}
		};

		getUserData();
	}, [userDataLength]);

	// create function that accepts the book's mongo _id value as param and deletes the book from the database
	const handleDeleteBook = async (bookId) => {
		const token = Auth.loggedIn() ? Auth.getToken() : null;

		if (!token) {
			return false;
		}

		try {
			await removeBook({
				variables: { bookId: bookId }
			});

			userRequest.refetch();

			removeBookId(bookId);
		} catch (err) {
			console.error(err);
		}
	};


	if (loading) {
		return <h2>LOADING...</h2>;

	}



	return (
		<>
			<Jumbotron fluid className="text-light bg-dark">
				<Container>
					<h1>Viewing saved books!</h1>
				</Container>
			</Jumbotron>
			<Container>
				<h2>
					{userData.savedBooks.length
						? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"
						}:`
						: "You have no saved books!"}
				</h2>
				<CardColumns>
					{userData.savedBooks.map((book) => {
						return (
							<Card key={book.bookId} border="dark">
								{book.image ? (
									<Card.Img
										src={book.image}
										alt={`The cover for ${book.title}`}
										variant="top"
									/>
								) : null}
								<Card.Body>
									<Card.Title>{book.title}</Card.Title>
									<p className="small">Authors: {book.authors}</p>
									<Card.Text>{book.description}</Card.Text>
									<Button
										className="btn-block btn-danger"
										onClick={() => handleDeleteBook(book.bookId)}
									>
										Delete this Book!
									</Button>
								</Card.Body>
							</Card>
						);
					})}
				</CardColumns>
			</Container>
		</>
	);
};

export default SavedBooks;
