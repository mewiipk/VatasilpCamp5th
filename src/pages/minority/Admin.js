import React, {useState, useEffect} from 'react';
import {db} from '../../Firebase';

export default function AdminMinority() {
    const [listener, setListener] = useState()
    const [result, setResult] = useState([])

    console.log(result)

    useEffect(() => {
        async function getDB() {
            const listener = await db.collection("minority")
                .onSnapshot((querySnapshot) => {
                const result = [];
                querySnapshot.forEach((doc) => {
                    result.push(doc.data());
                });
                console.log(result)
                setResult(result);
                return
            });
            setListener(listener);
        }
        getDB();
    }, [])

    return (
        <div>Admin</div>
    )
}