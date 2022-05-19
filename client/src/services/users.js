const baseUrl = `${process.env.CLIENT_URL}/api/users`;

const getAll = async () => {
	const res = await fetch(`${baseUrl}/`, { method: "GET" });
	const data = await res.json();
	return data;
};
const update = async (user_id, { username, password }) => {
	const res = await fetch(`${baseUrl}/${user_id}`, {
		method: "PUT",
		body: { username, password },
		headers: { "Content-Type": "application/json" },
	});
	const data = await res.json();
	return data;
};
const updateAvatar = async (user_id, file) => {
	const res = await fetch(`${baseUrl}/${user_id}/avatar`, {
		method: "PUT",
		body: { file },
		headers: { "Content-Type": "multipart/form-data" },
	});
	const data = await res.json();
	return data;
};
const deleteUser = async (user_id) => {
	const res = await fetch(`${baseUrl}/${user_id}`, {
		method: "DELETE",
		headers: { "Content-Type": "application" },
	});
	const data = await res.json();
	return data;
};

export default { getAll, update, updateAvatar, deleteUser };
