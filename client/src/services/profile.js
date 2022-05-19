const baseUrl = `${process.env.CLIENT_URL}/api/profile`;

const getAll = async () => {
	const res = await fetch(`${baseUrl}/`, { method: "GET" });
	const data = await res.json();
	return data;
};
const getCurrent = async () => {
	const res = await fetch(`${baseUrl}/me`, { method: "GET" });
	const data = await res.json();
	return data;
};
const getById = async (user_id) => {
	const res = await fetch(`${baseUrl}/${user_id}`, { method: "GET" });
	const data = await res.json();
	return data;
};
const follow = async (user_id) => {
	const res = await fetch(`${baseUrl}/${user_id}/follow`, { method: "PUT" });
	const data = await res.json();
	return data;
};
const unfollow = async (user_id) => {
	const res = await fetch(`${baseUrl}/${user_id}/unfollow`, {
		method: "PUT",
	});
	const data = await res.json();
	return data;
};
const updateProfile = async (user_id, { bio }) => {
	const res = await fetch(`${baseUrl}/${user_id}/`, {
		method: "PUT",
		body: { bio },
		headers: { "Content-Type": "application/json" },
	});
	const data = await res.json();
	return data;
};
export default { getAll, getCurrent, getById, follow, unfollow, updateProfile };
