'use client'

import React, { useState } from 'react';

const ClientPage: React.FC<{middlewareSet:string|null}> = (middlewareSet) => {
    return (
        <div>
            <br/>
            <p>ClientPage</p>
            {
                middlewareSet &&  JSON.stringify({middlewareSet})
            }
        </div>
    )
}

export default ClientPage