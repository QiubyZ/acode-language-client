// File: LSPUniversalHandler.js

export class LSPUniversalHandler {
	constructor(editorManager) {
		this.editorManager = editorManager;
	}

	/**
	 * Normalisasi respons LSP ke format yang seragam.
	 * Mendukung variasi format 'changes' dan 'documentChanges'.
	 * @param {Object} response - Respons dari LSP.
	 * @returns {Array} - Array of normalized edits.
	 */
	normalizeLSPResponse(response) {
		const normalizedEdits = [];

		// Deteksi format 'changes' (Java/JDTLS, dll.)
		if (response.edit && response.edit.changes) {
			console.log("Processing 'changes' format...");
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

		// Deteksi format 'documentChanges' (Golang, TypeScript, dll.)
		if (response.edit && response.edit.documentChanges) {
			console.log("Processing 'documentChanges' format...");
			response.edit.documentChanges.forEach((documentChange) => {
				// Handle TextDocumentEdit
				if (documentChange.textDocument && documentChange.edits) {
					const uri = documentChange.textDocument.uri;
					documentChange.edits.forEach((edit) => {
						normalizedEdits.push({
							uri,
							range: edit.range,
							newText: edit.newText,
						});
					});
				}
				// Handle CreateFile, RenameFile, DeleteFile (opsional)
				else if (documentChange.kind === "create") {
					console.warn("CreateFile operation detected but not implemented.");
				} else if (documentChange.kind === "rename") {
					console.warn("RenameFile operation detected but not implemented.");
				} else if (documentChange.kind === "delete") {
					console.warn("DeleteFile operation detected but not implemented.");
				}
			});
		}

		// Jika tidak ada format yang dikenali
		if (normalizedEdits.length === 0) {
			console.warn("Unknown or unsupported LSP response format");
		}

		return normalizedEdits;
	}

	/**
	 * Menerapkan perubahan ke editor.
	 * @param {Array} edits - Array of normalized edits.
	 */
	applyTextEdits(edits) {
		const session = this.editorManager.editor.getSession();

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
	processLSPResponse(response) {
		// Normalize the LSP response automatically
		const normalizedEdits = this.normalizeLSPResponse(response);

		// Apply the edits to the editor
		this.applyTextEdits(normalizedEdits);
	}
}
