import { Pipe, PipeTransform } from '@angular/core';
import { UserInfo } from './types';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {

    transform(items: UserInfo[], searchText: string, searchField: string): any[] {
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }
        searchText = searchText.toLocaleLowerCase();

        return items.filter(it => {
            return it[searchField].toLocaleLowerCase().includes(searchText);
        });
    }
}
