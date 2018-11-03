export const stages = {
	'desert': 1,
	'desertForest': 2,
	'forest': 3,
	'forestMountain': 4,
	'mountain': 5,
	'mountainHell': 6,
	'hell': 7
}

export const markers = [
	{
		increment: 20,
		do: {
			type: 'text',
			contents: [
				'Press < or > against a wall to slide and slow your fall.',
				'Then hit S to kick off.'
			],
			position: {x: 0, y: 0}
		}
	}
]
