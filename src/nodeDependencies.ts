import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// https://storageapi.fleek.co/bluer-team-bucket/wrappers.json

export class DepNodeProvider implements vscode.TreeDataProvider<Dependency> {

	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined | void> = new vscode.EventEmitter<Dependency | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined | void> = this._onDidChangeTreeData.event;

	constructor(private workspaceRoot: string | undefined) {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		if (element) {
			return Promise.resolve([]);
		} else {
			return Promise.resolve(this.getDepsInPackageJson());
		}
	}
	private getDepsInPackageJson(): Dependency[] {
		const packageJson = wrappers;

		const toDep = (moduleName: string, version: string): Dependency => {
			return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None, {
				command: 'extension.wrapperSelect',
				title: '',
				arguments: [moduleName]
			});
		};

		const deps = packageJson.dependencies
			? Object.keys(packageJson.dependencies).map(dep => toDep(dep, packageJson.dependencies[dep]))
			: [];
		return deps;
	}
}

const wrappers = {
    "dependencies": {
        "Uniswap": "0.3.0",
        "ENS": "0.0.3",
        "OpenSea": "0.2.4",
        "Radicle": "0.2.1",
		"Bankless": "0.1.8",
		"BadgerDAO": "0.0.8"
      }
};

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		private readonly version: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${this.version}`;
		this.description = this.version;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
	};

	contextValue = 'dependency';
}
