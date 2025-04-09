// File: lspHandler.js

/**
 * Fungsi untuk menormalisasi respons LSP ke format yang seragam.
 * Mendeteksi otomatis apakah formatnya 'changes' (Java/JDTLS) atau 'documentChanges' (Golang/Go Language Server).
 * @param {Object} response - Respons dari LSP.
 * @returns {Array} - Array of normalized edits.
 */
function normalizeLSPResponse(response) {
	const normalizedEdits = [];

	// Deteksi format 'changes' (Java/JDTLS)
	if (response.edit && response.edit.changes) {
		console.log("Detected 'changes' format (Java/JDTLS)");
		for (const [uri, changes] of Object.entries(response.edit.changes)) {
			changes.forEach((change) => {
				normalizedEdits.push({
					uri,
					range: change.range,
					newText: change.newText,
				});
			});
		}
	}

	// Deteksi format 'documentChanges' (Golang/Go Language Server)
	if (response.edit && response.edit.documentChanges) {
		console.log("Detected 'documentChanges' format (Golang)");
		response.edit.documentChanges.forEach((documentChange) => {
			const uri = documentChange.textDocument.uri;
			documentChange.edits.forEach((edit) => {
				normalizedEdits.push({
					uri,
					range: edit.range,
					newText: edit.newText,
				});
			});
		});
	}

	// Jika tidak ada format yang dikenali
	if (normalizedEdits.length === 0) {
		console.warn("Unknown LSP response format");
	}

	return normalizedEdits;
}

/**
 * Fungsi umum untuk menerapkan perubahan ke editor.
 * @param {Array} edits - Array of normalized edits.
 */
function applyTextEdits(edits) {
	const session = editorManager.editor.getSession();

	edits.forEach((edit) => {
		const { uri, range, newText } = edit;

		// Convert range to Ace Editor format
		const startPos = { row: range.start.line, column: range.start.character };
		const endPos = { row: range.end.line, column: range.end.character };

		// Apply the change to the editor
		session.replace(
			{
				start: startPos,
				end: endPos,
			},
			newText,
		);
	});
}

/**
 * Fungsi utama untuk memproses respons LSP.
 * Normalisasi respons dan menerapkan perubahan ke editor.
 * @param {Object} response - Respons dari LSP.
 */
function processLSPResponse(response) {
	// Normalize the LSP response automatically
	const normalizedEdits = normalizeLSPResponse(response);

	// Apply the edits to the editor
	applyTextEdits(normalizedEdits);
}

// Contoh penggunaan:
// Anda hanya perlu memanggil `processLSPResponse` dengan respons dari LSP.
// Tidak perlu peduli apakah respons berasal dari Java atau Golang.

// Contoh Respons Java (JDTLS):
const javaResponse = {
	title: "Add all missing imports",
	kind: "source",
	diagnostics: [],
	edit: {
		changes: {
			"file:///path/to/JavaTest.java": [
				{
					range: {
						start: { line: 0, character: 12 },
						end: { line: 2, character: 0 },
					},
					newText:
						"\n\nimport java.util.ArrayList;\nimport java.util.HashMap;\nimport java.util.Map;\n\n",
				},
			],
		},
	},
};

// Contoh Respons Golang:
const golangResponse = {
	title: "Organize Imports",
	kind: "source.organizeImports",
	edit: {
		documentChanges: [
			{
				textDocument: {
					version: 8,
					uri: "file:///path/to/test.go",
				},
				edits: [
					{
						range: {
							start: { line: 1, character: 0 },
							end: { line: 1, character: 0 },
						},
						newText: '\nimport (\n\t"bufio"\n\t"fmt"\n\t"net/http"\n)\n',
					},
				],
			},
		],
	},
};

// Proses respons LSP
processLSPResponse(javaResponse); // Java
processLSPResponse(golangResponse); // Golang
