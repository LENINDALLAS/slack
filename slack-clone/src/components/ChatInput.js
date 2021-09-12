import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { db, auth } from '../firebase';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useSelector } from 'react-redux';
import { selectDirectName } from '../features/appSlice';



function ChatInput({ channelName, channelId, chatRef, query }) {
    const [input, setInput] = useState('');
    const [user] = useAuthState(auth);

    const directName = useSelector(selectDirectName);
    // console.log('query', query);
    // console.log('direct name', directName)

    const [owner] = useCollection(db.collection(directName))
    // console.log('owner', owner?.docs[0].data().contact);
    const select = owner?.docs.filter((doc) => {
        return doc.data().contact === query
    })
    // if (select) {
    //     console.log('selected', select[0]?.id);
    // }


    const sendMessage = (e) => {
        e.preventDefault();

        if (!channelId) {
            return false;
        }

        db.collection(query).doc(channelId).collection('message').add({
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user.displayName,
            userImage: user.photoURL,
        })

        if (query !== 'rooms') {
            db.collection(directName).doc(select[0]?.id).collection('message').add({
                message: input,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                user: user.displayName,
                userImage: user.photoURL,
            })
        }

        chatRef.current.scrollIntoView({
            behaviour: 'smooth',
        });

        setInput('')
    }

    return (
        <ChatInputContainer>
            <form>
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message ${channelName}`} />
                <Button hidden type='submit' onClick={sendMessage}>
                    SEND
                </Button>
            </form>
        </ChatInputContainer>
    );
}

export default ChatInput;

const ChatInputContainer = styled.div`
border-radius: 20px;

> form {
    position: relative;
    display: flex;
    justify-content: center;
}

> form > input {
    position: fixed;
    bottom: 30px;
    width: 60%;
    border: 1px solid gray;
    border-radius: 3px;
    padding: 20px;
    outline: none;
}

 > form > button {
        display: none !important;
    }
`;