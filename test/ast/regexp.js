module.exports = [
	{"type": "disjunction", "alternatives": [
		{"type": "alternative", "terms": [
			{"type": "group", "behavior": "normal", "disjunction": {"type": "alternative", "terms": [
				{"type": "escapeChar", "value": "S", "from": 1, "to": 3, "raw": "\\S"}
			], "from": 1, "to": 3, "raw": "\\S"}, "from": 0, "to": 4, "raw": "(\\S)", "matchIdx": 1, "lastMatchIdx": 1}
		], "from": 0, "to": 4, "raw": "(\\S)"},
		{"type": "alternative", "terms": [
			{"type": "group", "behavior": "normal", "disjunction": {"type": "alternative", "terms": [
				{"type": "dot", "from": 6, "to": 7, "raw": "."}
			], "from": 6, "to": 7, "raw": "."}, "from": 5, "to": 8, "raw": "(.)", "matchIdx": 2, "lastMatchIdx": 2}
		], "from": 5, "to": 8, "raw": "(.)"}
	], "from": 0, "to": 8, "raw": "(\\S)|(.)", "lastMatchIdx": 2},
	{
		"type": "disjunction",
		"alternatives": [
			{
				"type": "alternative",
				"terms": [
					{
						"type": "character",
						"char": "\"",
						"from": 0,
						"to": 1,
						"raw": "\""
					},
					{
						"type": "quantifier",
						"min": 0,
						"greedy": true,
						"child": {
							"type": "characterClass",
							"classRanges": [
								{
									"type": "character",
									"char": "\"",
									"from": 3,
									"to": 4,
									"raw": "\""
								}
							],
							"negative": true,
							"from": 1,
							"to": 5,
							"raw": "[^\"]"
						},
						"from": 5,
						"to": 6,
						"raw": "*"
					},
					{
						"type": "character",
						"char": "\"",
						"from": 6,
						"to": 7,
						"raw": "\""
					}
				],
				"from": 0,
				"to": 7,
				"raw": "\"[^\"]*\""
			},
			{
				"type": "alternative",
				"terms": [
					{
						"type": "character",
						"char": "'",
						"from": 8,
						"to": 9,
						"raw": "'"
					},
					{
						"type": "quantifier",
						"min": 0,
						"greedy": true,
						"child": {
							"type": "characterClass",
							"classRanges": [
								{
									"type": "character",
									"char": "'",
									"from": 11,
									"to": 12,
									"raw": "'"
								}
							],
							"negative": true,
							"from": 9,
							"to": 13,
							"raw": "[^']"
						},
						"from": 13,
						"to": 14,
						"raw": "*"
					},
					{
						"type": "character",
						"char": "'",
						"from": 14,
						"to": 15,
						"raw": "'"
					}
				],
				"from": 8,
				"to": 15,
				"raw": "'[^']*'"
			}
		],
		"from": 0,
		"to": 15,
		"raw": "\"[^\"]*\"|'[^']*'",
		"lastMatchIdx": 0
	},
	{
		"type": "disjunction",
		"alternatives": [
			{
				"type": "alternative",
				"terms": [
					{
						"type": "character",
						"char": "\"",
						"from": 0,
						"to": 1,
						"raw": "\""
					},
					{
						"type": "quantifier",
						"min": 0,
						"greedy": true,
						"child": {
							"type": "characterClass",
							"classRanges": [
								{
									"type": "character",
									"char": "<",
									"from": 3,
									"to": 4,
									"raw": "<"
								},
								{
									"type": "character",
									"char": "\"",
									"from": 4,
									"to": 5,
									"raw": "\""
								}
							],
							"negative": true,
							"from": 1,
							"to": 6,
							"raw": "[^<\"]"
						},
						"from": 6,
						"to": 7,
						"raw": "*"
					},
					{
						"type": "character",
						"char": "\"",
						"from": 7,
						"to": 8,
						"raw": "\""
					}
				],
				"from": 0,
				"to": 8,
				"raw": "\"[^<\"]*\""
			},
			{
				"type": "alternative",
				"terms": [
					{
						"type": "character",
						"char": "'",
						"from": 9,
						"to": 10,
						"raw": "'"
					},
					{
						"type": "quantifier",
						"min": 0,
						"greedy": true,
						"child": {
							"type": "characterClass",
							"classRanges": [
								{
									"type": "character",
									"char": "<",
									"from": 12,
									"to": 13,
									"raw": "<"
								},
								{
									"type": "character",
									"char": "'",
									"from": 13,
									"to": 14,
									"raw": "'"
								}
							],
							"negative": true,
							"from": 10,
							"to": 15,
							"raw": "[^<']"
						},
						"from": 15,
						"to": 16,
						"raw": "*"
					},
					{
						"type": "character",
						"char": "'",
						"from": 16,
						"to": 17,
						"raw": "'"
					}
				],
				"from": 9,
				"to": 17,
				"raw": "'[^<']*'"
			}
		],
		"from": 0,
		"to": 17,
		"raw": "\"[^<\"]*\"|'[^<']*'",
		"lastMatchIdx": 0
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "assertion",
				"sub": "end",
				"from": 0,
				"to": 1,
				"raw": "$"
			},
			{
				"type": "character",
				"char": "s",
				"from": 1,
				"to": 2,
				"raw": "s"
			},
			{
				"type": "character",
				"char": "u",
				"from": 2,
				"to": 3,
				"raw": "u"
			},
			{
				"type": "character",
				"char": "p",
				"from": 3,
				"to": 4,
				"raw": "p"
			}
		],
		"from": 0,
		"to": 4,
		"raw": "$sup",
		"lastMatchIdx": 0
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "normal",
				"disjunction": {
					"type": "disjunction",
					"alternatives": [
						{
							"type": "alternative",
							"terms": [
								{
									"type": "group",
									"behavior": "normal",
									"disjunction": {
										"type": "alternative",
										"terms": [
											{
												"type": "character",
												"char": "1",
												"from": 2,
												"to": 3,
												"raw": "1"
											}
										],
										"from": 2,
										"to": 3,
										"raw": "1"
									},
									"from": 1,
									"to": 4,
									"raw": "(1)",
									"matchIdx": 2,
									"lastMatchIdx": 2
								}
							],
							"from": 1,
							"to": 4,
							"raw": "(1)"
						},
						{
							"type": "alternative",
							"terms": [
								{
									"type": "group",
									"behavior": "normal",
									"disjunction": {
										"type": "alternative",
										"terms": [
											{
												"type": "character",
												"char": "1",
												"from": 6,
												"to": 7,
												"raw": "1"
											},
											{
												"type": "character",
												"char": "2",
												"from": 7,
												"to": 8,
												"raw": "2"
											}
										],
										"from": 6,
										"to": 8,
										"raw": "12"
									},
									"from": 5,
									"to": 9,
									"raw": "(12)",
									"matchIdx": 3,
									"lastMatchIdx": 3
								}
							],
							"from": 5,
							"to": 9,
							"raw": "(12)"
						}
					],
					"from": 1,
					"to": 9,
					"raw": "(1)|(12)"
				},
				"from": 0,
				"to": 10,
				"raw": "((1)|(12))",
				"matchIdx": 1,
				"lastMatchIdx": 3
			},
			{
				"type": "group",
				"behavior": "normal",
				"disjunction": {
					"type": "disjunction",
					"alternatives": [
						{
							"type": "alternative",
							"terms": [
								{
									"type": "group",
									"behavior": "normal",
									"disjunction": {
										"type": "alternative",
										"terms": [
											{
												"type": "character",
												"char": "3",
												"from": 12,
												"to": 13,
												"raw": "3"
											}
										],
										"from": 12,
										"to": 13,
										"raw": "3"
									},
									"from": 11,
									"to": 14,
									"raw": "(3)",
									"matchIdx": 5,
									"lastMatchIdx": 5
								}
							],
							"from": 11,
							"to": 14,
							"raw": "(3)"
						},
						{
							"type": "alternative",
							"terms": [
								{
									"type": "group",
									"behavior": "normal",
									"disjunction": {
										"type": "alternative",
										"terms": [
											{
												"type": "character",
												"char": "2",
												"from": 16,
												"to": 17,
												"raw": "2"
											},
											{
												"type": "character",
												"char": "3",
												"from": 17,
												"to": 18,
												"raw": "3"
											}
										],
										"from": 16,
										"to": 18,
										"raw": "23"
									},
									"from": 15,
									"to": 19,
									"raw": "(23)",
									"matchIdx": 6,
									"lastMatchIdx": 6
								}
							],
							"from": 15,
							"to": 19,
							"raw": "(23)"
						}
					],
					"from": 11,
					"to": 19,
					"raw": "(3)|(23)"
				},
				"from": 10,
				"to": 20,
				"raw": "((3)|(23))",
				"matchIdx": 4,
				"lastMatchIdx": 6
			}
		],
		"from": 0,
		"to": 20,
		"raw": "((1)|(12))((3)|(23))",
		"lastMatchIdx": 6
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "normal",
				"disjunction": {
					"type": "alternative",
					"terms": [
						{
							"type": "dot",
							"from": 1,
							"to": 2,
							"raw": "."
						}
					],
					"from": 1,
					"to": 2,
					"raw": "."
				},
				"from": 0,
				"to": 3,
				"raw": "(.)",
				"matchIdx": 1,
				"lastMatchIdx": 1
			},
			{
				"type": "ref",
				"ref": 1,
				"from": 3,
				"to": 5,
				"raw": "\\1"
			}
		],
		"from": 0,
		"to": 5,
		"raw": "(.)\\1",
		"lastMatchIdx": 1
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "ignore",
				"disjunction": {
					"type": "alternative",
					"terms": [
						{
							"type": "empty",
							"from": 3,
							"to": 3,
							"raw": ""
						}
					],
					"from": 3,
					"to": 3,
					"raw": ""
				},
				"from": 0,
				"to": 4,
				"raw": "(?:)"
			}
		],
		"from": 0,
		"to": 4,
		"raw": "(?:)",
		"lastMatchIdx": 0
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "ignore",
				"disjunction": {
					"type": "disjunction",
					"alternatives": [
						{
							"type": "alternative",
							"terms": [
								{
									"type": "character",
									"char": "a",
									"from": 3,
									"to": 4,
									"raw": "a"
								},
								{
									"type": "character",
									"char": "b",
									"from": 4,
									"to": 5,
									"raw": "b"
								}
							],
							"from": 3,
							"to": 5,
							"raw": "ab"
						},
						{
							"type": "alternative",
							"terms": [
								{
									"type": "character",
									"char": "c",
									"from": 6,
									"to": 7,
									"raw": "c"
								},
								{
									"type": "character",
									"char": "d",
									"from": 7,
									"to": 8,
									"raw": "d"
								}
							],
							"from": 6,
							"to": 8,
							"raw": "cd"
						}
					],
					"from": 3,
					"to": 8,
					"raw": "ab|cd"
				},
				"from": 0,
				"to": 9,
				"raw": "(?:ab|cd)"
			},
			{
				"type": "quantifier",
				"min": 0,
				"max": 1,
				"greedy": true,
				"child": {
					"type": "escapeChar",
					"value": "d",
					"from": 9,
					"to": 11,
					"raw": "\\d"
				},
				"from": 11,
				"to": 12,
				"raw": "?"
			}
		],
		"from": 0,
		"to": 12,
		"raw": "(?:ab|cd)\\d?",
		"lastMatchIdx": 0
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "ignore",
				"disjunction": {
					"type": "alternative",
					"terms": [
						{
							"type": "character",
							"char": "x",
							"from": 3,
							"to": 4,
							"raw": "x"
						}
					],
					"from": 3,
					"to": 4,
					"raw": "x"
				},
				"from": 0,
				"to": 5,
				"raw": "(?:x)"
			}
		],
		"from": 0,
		"to": 5,
		"raw": "(?:x)",
		"lastMatchIdx": 0
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "normal",
				"disjunction": {
					"type": "disjunction",
					"alternatives": [
						{
							"type": "alternative",
							"terms": [
								{
									"type": "characterClass",
									"classRanges": [
										{
											"type": "characterClassRange",
											"min": {
												"type": "character",
												"char": "A",
												"from": 2,
												"to": 3,
												"raw": "A"
											},
											"max": {
												"type": "character",
												"char": "Z",
												"from": 4,
												"to": 5,
												"raw": "Z"
											},
											"from": 3,
											"to": 5,
											"raw": "-Z"
										},
										{
											"type": "characterClassRange",
											"min": {
												"type": "character",
												"char": "a",
												"from": 5,
												"to": 6,
												"raw": "a"
											},
											"max": {
												"type": "character",
												"char": "z",
												"from": 7,
												"to": 8,
												"raw": "z"
											},
											"from": 6,
											"to": 8,
											"raw": "-z"
										},
										{
											"type": "character",
											"char": "_",
											"from": 8,
											"to": 9,
											"raw": "_"
										},
										{
											"type": "character",
											"char": ":",
											"from": 9,
											"to": 10,
											"raw": ":"
										}
									],
									"negative": false,
									"from": 1,
									"to": 11,
									"raw": "[A-Za-z_:]"
								}
							],
							"from": 1,
							"to": 11,
							"raw": "[A-Za-z_:]"
						},
						{
							"type": "alternative",
							"terms": [
								{
									"type": "characterClass",
									"classRanges": [
										{
											"type": "characterClassRange",
											"min": {
												"type": "escape",
												"name": "hex",
												"value": "00",
												"from": 15,
												"to": 18,
												"raw": "x00"
											},
											"max": {
												"type": "escape",
												"name": "hex",
												"value": "7F",
												"from": 20,
												"to": 23,
												"raw": "x7F"
											},
											"from": 18,
											"to": 23,
											"raw": "-\\x7F"
										}
									],
									"negative": true,
									"from": 12,
									"to": 24,
									"raw": "[^\\x00-\\x7F]"
								}
							],
							"from": 12,
							"to": 24,
							"raw": "[^\\x00-\\x7F]"
						}
					],
					"from": 1,
					"to": 24,
					"raw": "[A-Za-z_:]|[^\\x00-\\x7F]"
				},
				"from": 0,
				"to": 25,
				"raw": "([A-Za-z_:]|[^\\x00-\\x7F])",
				"matchIdx": 1,
				"lastMatchIdx": 1
			},
			{
				"type": "quantifier",
				"min": 0,
				"greedy": true,
				"child": {
					"type": "group",
					"behavior": "normal",
					"disjunction": {
						"type": "disjunction",
						"alternatives": [
							{
								"type": "alternative",
								"terms": [
									{
										"type": "characterClass",
										"classRanges": [
											{
												"type": "characterClassRange",
												"min": {
													"type": "character",
													"char": "A",
													"from": 27,
													"to": 28,
													"raw": "A"
												},
												"max": {
													"type": "character",
													"char": "Z",
													"from": 29,
													"to": 30,
													"raw": "Z"
												},
												"from": 28,
												"to": 30,
												"raw": "-Z"
											},
											{
												"type": "characterClassRange",
												"min": {
													"type": "character",
													"char": "a",
													"from": 30,
													"to": 31,
													"raw": "a"
												},
												"max": {
													"type": "character",
													"char": "z",
													"from": 32,
													"to": 33,
													"raw": "z"
												},
												"from": 31,
												"to": 33,
												"raw": "-z"
											},
											{
												"type": "characterClassRange",
												"min": {
													"type": "character",
													"char": "0",
													"from": 33,
													"to": 34,
													"raw": "0"
												},
												"max": {
													"type": "character",
													"char": "9",
													"from": 35,
													"to": 36,
													"raw": "9"
												},
												"from": 34,
												"to": 36,
												"raw": "-9"
											},
											{
												"type": "character",
												"char": "_",
												"from": 36,
												"to": 37,
												"raw": "_"
											},
											{
												"type": "character",
												"char": ":",
												"from": 37,
												"to": 38,
												"raw": ":"
											},
											{
												"type": "character",
												"char": ".",
												"from": 38,
												"to": 39,
												"raw": "."
											},
											{
												"type": "character",
												"char": "-",
												"from": 39,
												"to": 40,
												"raw": "-"
											}
										],
										"negative": false,
										"from": 26,
										"to": 41,
										"raw": "[A-Za-z0-9_:.-]"
									}
								],
								"from": 26,
								"to": 41,
								"raw": "[A-Za-z0-9_:.-]"
							},
							{
								"type": "alternative",
								"terms": [
									{
										"type": "characterClass",
										"classRanges": [
											{
												"type": "characterClassRange",
												"min": {
													"type": "escape",
													"name": "hex",
													"value": "00",
													"from": 45,
													"to": 48,
													"raw": "x00"
												},
												"max": {
													"type": "escape",
													"name": "hex",
													"value": "7F",
													"from": 50,
													"to": 53,
													"raw": "x7F"
												},
												"from": 48,
												"to": 53,
												"raw": "-\\x7F"
											}
										],
										"negative": true,
										"from": 42,
										"to": 54,
										"raw": "[^\\x00-\\x7F]"
									}
								],
								"from": 42,
								"to": 54,
								"raw": "[^\\x00-\\x7F]"
							}
						],
						"from": 26,
						"to": 54,
						"raw": "[A-Za-z0-9_:.-]|[^\\x00-\\x7F]"
					},
					"from": 25,
					"to": 55,
					"raw": "([A-Za-z0-9_:.-]|[^\\x00-\\x7F])",
					"matchIdx": 2,
					"lastMatchIdx": 2
				},
				"from": 55,
				"to": 56,
				"raw": "*",
				"firstMatchIdx": 2,
				"lastMatchIdx": 2
			}
		],
		"from": 0,
		"to": 56,
		"raw": "([A-Za-z_:]|[^\\x00-\\x7F])([A-Za-z0-9_:.-]|[^\\x00-\\x7F])*",
		"lastMatchIdx": 2
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "normal",
				"disjunction": {
					"type": "disjunction",
					"alternatives": [
						{
							"type": "alternative",
							"terms": [
								{
									"type": "quantifier",
									"min": 0,
									"max": 1,
									"greedy": true,
									"child": {
										"type": "characterClass",
										"classRanges": [
											{
												"type": "character",
												"char": "N",
												"from": 2,
												"to": 3,
												"raw": "N"
											},
											{
												"type": "character",
												"char": "n",
												"from": 3,
												"to": 4,
												"raw": "n"
											}
										],
										"negative": false,
										"from": 1,
										"to": 5,
										"raw": "[Nn]"
									},
									"from": 5,
									"to": 6,
									"raw": "?"
								},
								{
									"type": "character",
									"char": "e",
									"from": 6,
									"to": 7,
									"raw": "e"
								},
								{
									"type": "character",
									"char": "v",
									"from": 7,
									"to": 8,
									"raw": "v"
								},
								{
									"type": "character",
									"char": "e",
									"from": 8,
									"to": 9,
									"raw": "e"
								},
								{
									"type": "character",
									"char": "r",
									"from": 9,
									"to": 10,
									"raw": "r"
								}
							],
							"from": 1,
							"to": 10,
							"raw": "[Nn]?ever"
						},
						{
							"type": "alternative",
							"terms": [
								{
									"type": "group",
									"behavior": "normal",
									"disjunction": {
										"type": "alternative",
										"terms": [
											{
												"type": "characterClass",
												"classRanges": [
													{
														"type": "character",
														"char": "N",
														"from": 13,
														"to": 14,
														"raw": "N"
													},
													{
														"type": "character",
														"char": "n",
														"from": 14,
														"to": 15,
														"raw": "n"
													}
												],
												"negative": false,
												"from": 12,
												"to": 16,
												"raw": "[Nn]"
											},
											{
												"type": "character",
												"char": "o",
												"from": 16,
												"to": 17,
												"raw": "o"
											},
											{
												"type": "character",
												"char": "t",
												"from": 17,
												"to": 18,
												"raw": "t"
											},
											{
												"type": "character",
												"char": "h",
												"from": 18,
												"to": 19,
												"raw": "h"
											},
											{
												"type": "character",
												"char": "i",
												"from": 19,
												"to": 20,
												"raw": "i"
											},
											{
												"type": "character",
												"char": "n",
												"from": 20,
												"to": 21,
												"raw": "n"
											},
											{
												"type": "character",
												"char": "g",
												"from": 21,
												"to": 22,
												"raw": "g"
											},
											{
												"type": "quantifier",
												"min": 1,
												"greedy": true,
												"child": {
													"type": "escapeChar",
													"value": "s",
													"from": 22,
													"to": 24,
													"raw": "\\s"
												},
												"from": 24,
												"to": 28,
												"raw": "{1,}"
											}
										],
										"from": 12,
										"to": 28,
										"raw": "[Nn]othing\\s{1,}"
									},
									"from": 11,
									"to": 29,
									"raw": "([Nn]othing\\s{1,})",
									"matchIdx": 2,
									"lastMatchIdx": 2
								}
							],
							"from": 11,
							"to": 29,
							"raw": "([Nn]othing\\s{1,})"
						}
					],
					"from": 1,
					"to": 29,
					"raw": "[Nn]?ever|([Nn]othing\\s{1,})"
				},
				"from": 0,
				"to": 30,
				"raw": "([Nn]?ever|([Nn]othing\\s{1,}))",
				"matchIdx": 1,
				"lastMatchIdx": 2
			},
			{
				"type": "character",
				"char": "m",
				"from": 30,
				"to": 31,
				"raw": "m"
			},
			{
				"type": "character",
				"char": "o",
				"from": 31,
				"to": 32,
				"raw": "o"
			},
			{
				"type": "character",
				"char": "r",
				"from": 32,
				"to": 33,
				"raw": "r"
			},
			{
				"type": "character",
				"char": "e",
				"from": 33,
				"to": 34,
				"raw": "e"
			}
		],
		"from": 0,
		"to": 34,
		"raw": "([Nn]?ever|([Nn]othing\\s{1,}))more",
		"lastMatchIdx": 2
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "quantifier",
				"min": 0,
				"greedy": true,
				"child": {
					"type": "group",
					"behavior": "normal",
					"disjunction": {
						"type": "disjunction",
						"alternatives": [
							{
								"type": "alternative",
								"terms": [
									{
										"type": "characterClass",
										"classRanges": [],
										"negative": true,
										"from": 1,
										"to": 4,
										"raw": "[^]"
									},
									{
										"type": "character",
										"char": "\"",
										"from": 4,
										"to": 5,
										"raw": "\""
									},
									{
										"type": "character",
										"char": "'",
										"from": 5,
										"to": 6,
										"raw": "'"
									},
									{
										"type": "character",
										"char": ">",
										"from": 6,
										"to": 7,
										"raw": ">"
									},
									{
										"type": "character",
										"char": "<",
										"from": 7,
										"to": 8,
										"raw": "<"
									},
									{
										"type": "quantifier",
										"min": 1,
										"greedy": true,
										"child": {
											"type": "character",
											"char": "]",
											"from": 8,
											"to": 9,
											"raw": "]"
										},
										"from": 9,
										"to": 10,
										"raw": "+"
									}
								],
								"from": 1,
								"to": 10,
								"raw": "[^]\"'><]+"
							},
							{
								"type": "alternative",
								"terms": [
									{
										"type": "character",
										"char": "\"",
										"from": 11,
										"to": 12,
										"raw": "\""
									},
									{
										"type": "quantifier",
										"min": 0,
										"greedy": true,
										"child": {
											"type": "characterClass",
											"classRanges": [
												{
													"type": "character",
													"char": "\"",
													"from": 14,
													"to": 15,
													"raw": "\""
												}
											],
											"negative": true,
											"from": 12,
											"to": 16,
											"raw": "[^\"]"
										},
										"from": 16,
										"to": 17,
										"raw": "*"
									},
									{
										"type": "character",
										"char": "\"",
										"from": 17,
										"to": 18,
										"raw": "\""
									}
								],
								"from": 11,
								"to": 18,
								"raw": "\"[^\"]*\""
							},
							{
								"type": "alternative",
								"terms": [
									{
										"type": "character",
										"char": "'",
										"from": 19,
										"to": 20,
										"raw": "'"
									},
									{
										"type": "quantifier",
										"min": 0,
										"greedy": true,
										"child": {
											"type": "characterClass",
											"classRanges": [
												{
													"type": "character",
													"char": "'",
													"from": 22,
													"to": 23,
													"raw": "'"
												}
											],
											"negative": true,
											"from": 20,
											"to": 24,
											"raw": "[^']"
										},
										"from": 24,
										"to": 25,
										"raw": "*"
									},
									{
										"type": "character",
										"char": "'",
										"from": 25,
										"to": 26,
										"raw": "'"
									}
								],
								"from": 19,
								"to": 26,
								"raw": "'[^']*'"
							}
						],
						"from": 1,
						"to": 26,
						"raw": "[^]\"'><]+|\"[^\"]*\"|'[^']*'"
					},
					"from": 0,
					"to": 27,
					"raw": "([^]\"'><]+|\"[^\"]*\"|'[^']*')",
					"matchIdx": 1,
					"lastMatchIdx": 1
				},
				"from": 27,
				"to": 28,
				"raw": "*",
				"firstMatchIdx": 1,
				"lastMatchIdx": 1
			},
			{
				"type": "character",
				"char": ">",
				"from": 28,
				"to": 29,
				"raw": ">"
			}
		],
		"from": 0,
		"to": 29,
		"raw": "([^]\"'><]+|\"[^\"]*\"|'[^']*')*>",
		"lastMatchIdx": 1
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "normal",
				"disjunction": {
					"type": "alternative",
					"terms": [
						{
							"type": "escape",
							"name": "octal",
							"value": "1",
							"from": 1,
							"to": 3,
							"raw": "\\1"
						}
					],
					"from": 1,
					"to": 3,
					"raw": "\\1"
				},
				"from": 0,
				"to": 4,
				"raw": "(\\1)",
				"matchIdx": 1,
				"lastMatchIdx": 1
			}
		],
		"from": 0,
		"to": 4,
		"raw": "(\\1)",
		"lastMatchIdx": 1
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "normal",
				"disjunction": {
					"type": "alternative",
					"terms": [
						{
							"type": "quantifier",
							"min": 1,
							"greedy": true,
							"child": {
								"type": "escapeChar",
								"value": "d",
								"from": 1,
								"to": 3,
								"raw": "\\d"
							},
							"from": 3,
							"to": 4,
							"raw": "+"
						}
					],
					"from": 1,
					"to": 4,
					"raw": "\\d+"
				},
				"from": 0,
				"to": 5,
				"raw": "(\\d+)",
				"matchIdx": 1,
				"lastMatchIdx": 1
			}
		],
		"from": 0,
		"to": 5,
		"raw": "(\\d+)",
		"lastMatchIdx": 1
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "quantifier",
				"min": 0,
				"greedy": true,
				"child": {
					"type": "group",
					"behavior": "normal",
					"disjunction": {
						"type": "alternative",
						"terms": [
							{
								"type": "character",
								"char": "a",
								"from": 1,
								"to": 2,
								"raw": "a"
							}
						],
						"from": 1,
						"to": 2,
						"raw": "a"
					},
					"from": 0,
					"to": 3,
					"raw": "(a)",
					"matchIdx": 1,
					"lastMatchIdx": 1
				},
				"from": 3,
				"to": 4,
				"raw": "*",
				"firstMatchIdx": 1,
				"lastMatchIdx": 1
			}
		],
		"from": 0,
		"to": 4,
		"raw": "(a)*",
		"lastMatchIdx": 1
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "quantifier",
				"min": 0,
				"greedy": true,
				"child": {
					"type": "group",
					"behavior": "normal",
					"disjunction": {
						"type": "disjunction",
						"alternatives": [
							{
								"type": "alternative",
								"terms": [
									{
										"type": "character",
										"char": "a",
										"from": 1,
										"to": 2,
										"raw": "a"
									},
									{
										"type": "character",
										"char": "a",
										"from": 2,
										"to": 3,
										"raw": "a"
									}
								],
								"from": 1,
								"to": 3,
								"raw": "aa"
							},
							{
								"type": "alternative",
								"terms": [
									{
										"type": "character",
										"char": "a",
										"from": 4,
										"to": 5,
										"raw": "a"
									},
									{
										"type": "character",
										"char": "a",
										"from": 5,
										"to": 6,
										"raw": "a"
									},
									{
										"type": "character",
										"char": "b",
										"from": 6,
										"to": 7,
										"raw": "b"
									},
									{
										"type": "character",
										"char": "a",
										"from": 7,
										"to": 8,
										"raw": "a"
									},
									{
										"type": "character",
										"char": "a",
										"from": 8,
										"to": 9,
										"raw": "a"
									},
									{
										"type": "character",
										"char": "c",
										"from": 9,
										"to": 10,
										"raw": "c"
									}
								],
								"from": 4,
								"to": 10,
								"raw": "aabaac"
							},
							{
								"type": "alternative",
								"terms": [
									{
										"type": "character",
										"char": "b",
										"from": 11,
										"to": 12,
										"raw": "b"
									},
									{
										"type": "character",
										"char": "a",
										"from": 12,
										"to": 13,
										"raw": "a"
									}
								],
								"from": 11,
								"to": 13,
								"raw": "ba"
							},
							{
								"type": "alternative",
								"terms": [
									{
										"type": "character",
										"char": "b",
										"from": 14,
										"to": 15,
										"raw": "b"
									}
								],
								"from": 14,
								"to": 15,
								"raw": "b"
							},
							{
								"type": "alternative",
								"terms": [
									{
										"type": "character",
										"char": "c",
										"from": 16,
										"to": 17,
										"raw": "c"
									}
								],
								"from": 16,
								"to": 17,
								"raw": "c"
							}
						],
						"from": 1,
						"to": 17,
						"raw": "aa|aabaac|ba|b|c"
					},
					"from": 0,
					"to": 18,
					"raw": "(aa|aabaac|ba|b|c)",
					"matchIdx": 1,
					"lastMatchIdx": 1
				},
				"from": 18,
				"to": 19,
				"raw": "*",
				"firstMatchIdx": 1,
				"lastMatchIdx": 1
			}
		],
		"from": 0,
		"to": 19,
		"raw": "(aa|aabaac|ba|b|c)*",
		"lastMatchIdx": 1
	},
	{
		"type": "alternative",
		"terms": [
			{
				"type": "group",
				"behavior": "normal",
				"disjunction": {
					"type": "alternative",
					"terms": [
						{
							"type": "character",
							"char": "x",
							"from": 1,
							"to": 2,
							"raw": "x"
						}
					],
					"from": 1,
					"to": 2,
					"raw": "x"
				},
				"from": 0,
				"to": 3,
				"raw": "(x)",
				"matchIdx": 1,
				"lastMatchIdx": 1
			}
		],
		"from": 0,
		"to": 3,
		"raw": "(x)",
		"lastMatchIdx": 1
	}
];
