interface LanguageToolsResponseMatch {
	message: string;
	shortMessage: string;
	replacements: { value: string }[];
	offset: number;
	length: number;
	context: { text: string; offset: number; length: number };
	sentence: string;
	type: { typeName: string };
	rule: {
		id: string;
		description: string;
		issueType: string;
		category: {
			id: string;
			name: string;
		};
		isPremium: false;
	};

	ignoreForIncompleteSentence: boolean;
	contextForSureMatch: number;
}

export interface LanguageToolsCheckResponse {
	software: {
		name: string;
		version: string;
		buildDate: string;
		apiVersion: number;
		premium: boolean;
		premiumHint: string;
		status: string;
	};
	warnings: { incompleteResults: boolean };
	language: {
		name: string;
		code: string;
		detectedLanguage: {
			name: string;
			code: string;
			confidence: number;
			source: string;
		};
	};
	matches: LanguageToolsResponseMatch[];
	sentenceRanges: [number, number][];
}

type ResultsMatch = Pick<LanguageToolsResponseMatch, 'context' | 'offset' | 'message'>;

export interface Results {
	matches: ResultsMatch[];
}

export interface TextChunk {
	text: string;
	offsetAdjust: number;
}
