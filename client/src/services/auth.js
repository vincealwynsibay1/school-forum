const baseUrl = `${process.env.CLIENT_URL}/api/auth`;

const signin = async (credentials) => {
	const res = await fetch(`${baseUrl}/signin`, {
		method: "POST",
		body: JSON.stringify(credentials),
		headers: { "Content-Type": "application/json" },
	});

	const data = await res.json();
	return data;
};

const signup = async (credentials) => {
	const res = await fetch(`${baseUrl}/signup`, {
		method: "POST",
		body: JSON.stringify(credentials),
		headers: { "Content-Type": "application/json" },
	});
	const data = await res.json();

	return data;
};

export default { signin, signup };
