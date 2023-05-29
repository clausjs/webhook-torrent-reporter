import fetch from 'node-fetch';

export const get = async (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(res => res.json())
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}

export const post = async (url: string, body: { [id: string]: any }): Promise<any> => {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => {
                if (res.status === 204) return resolve(null);
                return res.json();   
            })
            .then(json => resolve(json))
            .catch(err => reject(err));
    });
}

