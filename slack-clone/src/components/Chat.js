import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import StarBorderOutlinedIcon from '@material-ui/icons/StarBorderOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useSelector } from 'react-redux';
import { selectRoomId } from '../features/appSlice';
import ChatInput from './ChatInput';
import { db, auth } from '../firebase';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Message from './Message';

function Chat(props) {

    const [heading, setHeading] = useState('');
    const [query, setQuery] = useState('');

    const chatRef = useRef(null);
    const [user] = useAuthState(auth);
    // console.log('user', user.email)


    const roomId = useSelector(selectRoomId);
    // console.log(' id ', roomId);

    const [roomDetails] = useDocument(
        roomId && db.collection('rooms').doc(roomId)
    );



    const [directMessageDetails] = useDocument(
        roomId && db.collection(user.email).doc(roomId)
    )
    // console.log('direct email', directMessageDetails?.data().contact);

    const [roomMessages, loading] = useCollection(
        roomId &&
        db
            .collection('rooms')
            .doc(roomId)
            .collection('message')
            .orderBy('timestamp', 'asc')
    )

    const [directMessages] = useCollection(
        roomId &&
        db
            .collection(user.email)
            .doc(roomId)
            .collection('message')
            .orderBy('timestamp', 'asc')
    )

    // console.log(roomDetails?.data());
    // console.log('room message', roomMessages);

    useEffect(() => {
        chatRef?.current?.scrollIntoView({
            behaviour: 'smooth',
        });

        // console.log(chatRef?.current);
    }, [roomId, loading]);

    useEffect(() => {

        if (!roomDetails) {
            setHeading(directMessageDetails?.data().contact)
            setQuery(user.email)
            // console.log('user', user.email)
        } else if (!directMessageDetails) {
            setHeading(roomDetails?.data().name)
            setQuery('rooms')
        }
    }, [directMessageDetails, roomDetails, user.email])



    return (
        <ChatContainer>
            {roomDetails && roomMessages && (
                <>
                    <Header >
                        <HeaderLeft>
                            <h4>
                                <strong>#{heading}</strong>
                            </h4>
                            <StarBorderOutlinedIcon />
                        </HeaderLeft>
                        <HeaderRight >
                            <p>
                                <InfoOutlinedIcon /> Details
                            </p>
                        </HeaderRight>
                    </Header>

                    <ChatMessages>


                        {roomMessages?.docs.map((doc) => {
                            const { message, timestamp, user, userImage } = doc.data();
                            // console.log(timestamp, 'time chat');
                            return (
                                <Message
                                    key={doc.id}
                                    message={message}
                                    timestamp={timestamp}
                                    user={user}
                                    userImage={userImage}
                                />
                            )
                        })}
                        {directMessages?.docs.map((doc) => {
                            const { message, timestamp, user, userImage } = doc.data();
                            // console.log(timestamp, 'time chat');
                            return (
                                <Message
                                    key={doc.id}
                                    message={message}
                                    timestamp={timestamp}
                                    user={user}
                                    userImage={userImage}
                                />
                            )
                        })}
                        <ChatBottom ref={chatRef} />
                    </ChatMessages>
                    <ChatInput
                        chatRef={chatRef}
                        channelName={heading}
                        channelId={roomId}
                        query={query}
                    />
                </>
            )}


        </ChatContainer>
    );
}

export default Chat;

const ChatBottom = styled.div`
padding-bottom: 200px;
`;

const Header = styled.div`
display: flex;
justify-content: space-between;
padding: 20px;
border-bottom: 1px solid lightgrey;
`;

const ChatMessages = styled.div`

`;

const HeaderLeft = styled.div`
display: flex;
align-items: center;

> h4 {
    display: flex;
    text-transform: lowercase;
    margin-right: 10px;
}

>h4 >.MuiSvgIcon-root {
    margin-left: 20px;
    font-size: 10px;
}
`;

const HeaderRight = styled.div`
> p {
    display: flex;
    align-items: center;
    font-size: 14px;
}
>p >.MuiSvgIcon-root {
    margin-right: 5px !important;
    font-size: 16px;
}
`;
const ChatContainer = styled.div`
flex: 0.7;
flex-grow: 1;
overflow-y: scroll;
margin-top: 60px;
`