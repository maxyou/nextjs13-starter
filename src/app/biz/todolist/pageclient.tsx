'use client'

import React from 'react';
import TodoListPage from './todolist'
import { JwtUser } from '@/common/tool/calc';
import { Client, Provider, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
    url: '/api/biz/todolist',
    exchanges: [cacheExchange, fetchExchange],
});

const ClientPage: React.FC<{ jwtUser: JwtUser }> = ({ jwtUser }) => {
    return (
        <div>
            <Provider value={client}>
                <div>

                    <p>ClientPage</p>
                    {
                        jwtUser && JSON.stringify({ jwtUser })
                    }
                    <TodoListPage jwtUser={jwtUser} />
                </div>
            </Provider>
        </div>
    )
}

export default ClientPage