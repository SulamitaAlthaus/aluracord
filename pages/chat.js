import { Box, Button, Image, Text, TextField } from '@skynexui/components';
import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';

const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


export default function ChatPage() {
    const [message, setMessage] = useState()
    const [listMessage, setListMessage] = useState([])

    function handleNewMessage(newMessage){
      const message = {
        from: 'sulamitaalthaus',
        text: newMessage,

      }
      supabaseClient
          .from('Message')
          .insert(message)
          .then(({ data }) => {
            setListMessage([
              data[0],
              ...listMessage
            ])
            
          })
      setMessage(' ')
    }

    useEffect(() => {
      supabaseClient
          .from('Message')
          .select('*')
          .order('id', { ascending: false })
          .then(({ data }) => {console.log('Dados da consulta: ', data)
          setListMessage(data)})
    }, [])
    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList message={listMessage}/>
                    
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(e) => {setMessage(e.target.value)}}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                handleNewMessage(message)
                              }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.message.map((message) => {
              return (
                <Text
                    key={message.id}
                    tag="li"
                    styleSheet={{
                        borderRadius: '5px',
                        padding: '6px',
                        marginBottom: '12px',
                        hover: {
                            backgroundColor: appConfig.theme.colors.neutrals[700],
                        }
                    }}
                >
                    <Box
                        styleSheet={{
                            marginBottom: '8px',
                        }}
                    >
                        <Image
                            styleSheet={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                display: 'inline-block',
                                marginRight: '8px',
                            }}
                            src={`https://github.com/${message.from}.png`}
                        />
                        <Text tag="strong">
                            {message.from}
                        </Text>
                        <Text
                            styleSheet={{
                                fontSize: '10px',
                                marginLeft: '8px',
                                color: appConfig.theme.colors.neutrals[300],
                            }}
                            tag="span"
                        >
                            {(new Date().toLocaleDateString())}
                        </Text>
                    </Box>
                    {message.text}
                </Text>
                
              )
            })}
        </Box>
    )
}