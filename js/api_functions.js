//API: phubahosi.vercel.app

export async function getUserDataSet(id) {
    try {
        return (
            await axios.get(`/user/${id}`, {
                baseURL: "https://phubahosi.vercel.app/api",
            })
        )["data"];
    } catch (error) {
        console.error(error);
    }
}
export async function postUserID(id) {
    try {
        let ColorData = null;
        await axios.get(`https://phubahosi.vercel.app/api/color/${id}`).then((response) => {
            ColorData = response.data
        });
        return ColorData;
    } catch (error) {
        console.error(error);
    }
}

export async function getUserTop(bestid) {
    try {
        return (
            await axios.get(`/user/${bestid}/best`, {
                baseURL: "https://phubahosi.vercel.app/api",
            })
        )["data"];
    } catch (error) {
        console.error(error);
    }
}

export async function getMapDataSet(beatmapID) {
    try {
        return (
            await axios.get(`/beatmap/${beatmapID}`, {
                baseURL: "https://phubahosi.vercel.app/api",
            })
        )["data"];
    } catch (error) {
        console.error(error);
    }
}

export async function getMapScores(beatmapID) {
    try {
        const data = (
            await axios.get(`/${beatmapID}/global`, {
                baseURL: "https://phubahosi.vercel.app/api/beatmap",
            })
        )["data"];
        return data.length !== 0 ? data : null;
    } catch (error) {
        console.error(error);
    }
}