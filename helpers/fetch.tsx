const baseUrl = process.env.NEXT_APP_API_URL;

export const fetchWithoutToken = async( endpoint: string, method: string = 'GET', data?: any,  ) => {
    const url: string = `${ baseUrl }/${endpoint}`;

    if(method == "GET") {
        const resp = await fetch( url );
        return await resp.json();
    } else {
        const resp = await fetch( url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data
        });

        return await resp.json();
    }
}

export const fetchWithToken = async( endpoint: string, method: string = 'GET', data?: any ) => {
    const url: string = `${ baseUrl }/${endpoint}`;
    const token: string = localStorage.getItem('token') || "";

    if(method == "GET") {
        const resp = await fetch( url, {
            headers: {
                'x-token': token
            }
        });
        return await resp.json();
    } else {
        const resp = await fetch( url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'x-token': token
            },
            body: data
        });

        return await resp.json();
    }
}