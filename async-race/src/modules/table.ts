import { sortTable } from '../views/winners/sort';
import Block from './block';
import type { RowData } from './types';

export default class Table extends Block<'table'> {
  private headersRow: TableRow;
  constructor(classname: string) {
    super('table', classname);
    this.headersRow = new TableRow(false);
    const headers = ['number', 'image', 'name', 'wins', 'best time'];
    this.generateHeaders(headers);
    this.addBlock(this.headersRow);
    this.headersRow.addListener('click', (event) => {
      sortTable.sortListener(event, this);
    });
    // this.initClasses();
  }

  public generateHeaders(headersNames: string[]): void {
    const createHeader = (text: string): void => {
      const header = new TableHeader();
      header.setText(text);
      this.headersRow.addBlock(header);
    };
    headersNames.forEach((name) => createHeader(name));
  }

  public addRow(data: RowData): void {
    const row = new TableRow(true);
    row.setRowData(data);
    this.addBlock(row);
  }
  public resetClasses(): void {
    const tableHeaders = this.headersRow.getComponents();
    tableHeaders[0].setClass('');
    tableHeaders[3].setClass('');
    tableHeaders[4].setClass('');
  }

  public clearRows(): void {
    this.getComponents().forEach((component, index) => {
      if (index > 0) {
        this.deleteBlock(component);
      }
    });
  }
}

class TableRow extends Block<'tr'> {
  private number: TableCell | undefined;
  private image: TableCell | undefined;
  private name: TableCell | undefined;
  private wins: TableCell | undefined;
  private time: TableCell | undefined;
  constructor(forWinner?: boolean) {
    super('tr');
    if (forWinner) {
      this.number = new TableCell();
      this.image = new TableCell();
      this.image.setClass('car-img');
      this.name = new TableCell();
      this.wins = new TableCell();
      this.time = new TableCell();
      this.addBlocks([
        this.number,
        this.image,
        this.name,
        this.wins,
        this.time,
      ]);
    }
  }

  public setRowData(data: RowData): void {
    if (this.number && this.image && this.name && this.wins && this.time) {
      this.number.setText(data.id);
      this.image.carColor(data.color);
      this.name.setText(data.name);
      this.wins.setText(`${data.wins}`);
      this.time.setText(`${data.time}`);
    }
  }
}

class TableHeader extends Block<'th'> {
  constructor() {
    super('th');
  }
}

class TableCell extends Block<'td'> {
  constructor() {
    super('td');
  }
  public carColor(color: string): void {
    this.getNode().style.backgroundColor = color;
  }
}
