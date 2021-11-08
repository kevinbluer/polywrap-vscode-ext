import * as vscode from 'vscode';

export class TestView {

	constructor(context: vscode.ExtensionContext) {
		const view = vscode.window.createTreeView('testView', { treeDataProvider: aNodeWithIdTreeDataProvider(treeUniswap), showCollapseAll: true });
		// const view = vscode.window.createTreeView('testViewDragAndDrop', { treeDataProvider: this, showCollapseAll: true, canSelectMany: true, dragAndDropController: this });
		
		context.subscriptions.push(view);
		vscode.commands.registerCommand('testView.reveal', async () => {
			const key = await vscode.window.showInputBox({ placeHolder: 'Type the label of the item to reveal' });
			if (key) {
				await view.reveal({ key }, { focus: true, select: false, expand: true });
			}
		});
		vscode.commands.registerCommand('testView.changeTitle', async () => {
			const title = await vscode.window.showInputBox({ prompt: 'Type the new title for the Test View', placeHolder: view.title });
			if (title) {
				view.title = title;
			}
		});
	}

	xyz(context: vscode.ExtensionContext, wrapper: string) {

		let tree: any;

		switch (wrapper.toLowerCase()) {
			case "uniswap":
				tree = treeUniswap;
				break;
			case "ens":
				tree = treeEns;
				break;
			case "opensea":
				tree = treeOpenSea;
				break;		
		}

		const view2 = vscode.window.createTreeView('testView', { treeDataProvider: aNodeWithIdTreeDataProvider(tree), showCollapseAll: true });
		context.subscriptions.push(view2);
	}
}

const treeUniswap = {
	'Initializes a class instance from two Tokens, if the pair\'s balances of these tokens are unknown and cannot be fetched externally. ': {
	}
};

const treeEns = {
	'getEnsAddress': {
	},
	'resolver': {
	}
};

const treeOpenSea = {
	'getAssetBalance': {
	},
	'createBuyOrder': {
	}
};

const nodes = {};

function aNodeWithIdTreeDataProvider(treeType: any): vscode.TreeDataProvider<{ key: string }> {
	return {
		getChildren: (element: { key: string }): { key: string }[] => {
			return getChildren(element ? element.key : undefined, treeType).map(key => getNode(key));
		},
		getTreeItem: (element: { key: string }): vscode.TreeItem => {
			const treeItem = getTreeItem(element.key, treeType);
			treeItem.id = element.key;
			return treeItem;
		},
		getParent: ({ key }: { key: string }): { key: string } => {
			const parentKey = key.substring(0, key.length - 1);
			return parentKey ? new Key(parentKey) : void 0;
		}
	};
}

function getChildren(key: string, treeType: any): string[] {
	if (!key) {
		return Object.keys(treeType);
	}
	const treeElement = getTreeElement(key, treeType);
	if (treeElement) {
		return Object.keys(treeElement);
	}
	return [];
}

function getTreeItem(key: string, treeType: any): vscode.TreeItem {
	const treeElement = getTreeElement(key, treeType);
	// An example of how to use codicons in a MarkdownString in a tree item tooltip.
	const tooltip = new vscode.MarkdownString(`$(zap) Tooltip for ${key}`, true);
	return {
		label: /**vscode.TreeItemLabel**/<any>{ label: key, highlights: key.length > 1 ? [[key.length - 2, key.length - 1]] : void 0 },
		tooltip,
		collapsibleState: treeElement && Object.keys(treeElement).length ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None
	};
}

function getTreeElement(element, treeType: any): any {

	let parent = treeType;

	if (parseInt(element) === NaN) {
		return element;
	} else {
		return 'x';
	}
	// for (let i = 0; i < element.length; i++) {
	// 	parent = parent[element.substring(0, i + 1)];
	// 	if (!parent) {
	// 		return null;
	// 	}
	// }
	// return element;
}

function getNode(key: string): { key: string } {
	if (!nodes[key]) {
		nodes[key] = new Key(key);
	}
	return nodes[key];
}

class Key {
	constructor(readonly key: string) { }
}