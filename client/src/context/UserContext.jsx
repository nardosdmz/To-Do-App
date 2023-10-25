import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const useUser = () => {
	return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
	const [userData, setUserData] = useState({
		token: undefined,
		user: undefined,
	});
	return (
		<UserContext.Provider value={{ userData, setUserData }}>
			{children}
		</UserContext.Provider>
	);
};
