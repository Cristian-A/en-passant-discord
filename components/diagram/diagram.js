
import { decode } from 'https://deno.land/x/imagescript@1.2.9/mod.ts';

const Board = {
	'b': await decode(Deno.readFileSync('./components/diagram/resources/bboard.png')),
	'w': await decode(Deno.readFileSync('./components/diagram/resources/wboard.png')),
};

const Pieces = {
	'bp': await decode(Deno.readFileSync('./components/diagram/resources/alpha/bp.png')),
	'bn': await decode(Deno.readFileSync('./components/diagram/resources/alpha/bn.png')),
	'bb': await decode(Deno.readFileSync('./components/diagram/resources/alpha/bb.png')),
	'bq': await decode(Deno.readFileSync('./components/diagram/resources/alpha/bq.png')),
	'bk': await decode(Deno.readFileSync('./components/diagram/resources/alpha/bk.png')),
	'br': await decode(Deno.readFileSync('./components/diagram/resources/alpha/br.png')),
	'wp': await decode(Deno.readFileSync('./components/diagram/resources/alpha/wp.png')),
	'wn': await decode(Deno.readFileSync('./components/diagram/resources/alpha/wn.png')),
	'wb': await decode(Deno.readFileSync('./components/diagram/resources/alpha/wb.png')),
	'wq': await decode(Deno.readFileSync('./components/diagram/resources/alpha/wq.png')),
	'wk': await decode(Deno.readFileSync('./components/diagram/resources/alpha/wk.png')),
	'wr': await decode(Deno.readFileSync('./components/diagram/resources/alpha/wr.png')),
};

export async function diagram(board, color) {
	const canvas = Board[color].clone();
	// drawing pieces:
	if (color == 'w') {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (board[i][j] == null) continue;
				const piece = Pieces[board[i][j].color + board[i][j].type];
				canvas.composite(piece, j * 100, i * 100);
			}
		}
	} else {
		for (let i = 7; i >= 0; i--) {
			for (let j = 7; j >= 0; j--) {
				if (board[i][j] == null) continue;
				const piece = Pieces[board[i][j].color + board[i][j].type];
				canvas.composite(piece, (7 - j) * 100, (7 - i) * 100);
			}
		}
	}
	return await canvas.encode();
}
