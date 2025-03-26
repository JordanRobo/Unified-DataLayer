export interface User {
	user_state: string;
	login_status: string;
	uem_hashed: string;
	session_id: string;
	divison_id: string;
}

export interface Loyalty {
	rId: string;
	birthDayMonth: string;
	firstLastName: string;
	tier: LoyaltyTier;
	reward: LoyaltyReward[];
	points: LoyaltyPoints;
}

export interface LoyaltyTier {
	name: string;
	id: string;
}

export interface LoyaltyReward {
	type: string;
	amount: string;
	expiry: string;
}

export interface LoyaltyPoints {
	current: string;
	spendToNextTier: string;
	pointsToNextTier: string;
}
