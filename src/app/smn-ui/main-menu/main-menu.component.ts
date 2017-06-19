import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'ui-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UiMainMenuComponent implements OnInit {
    @Input('menu-list') menuList: any = '';
    @Output('menu-click') menuClick = new EventEmitter();

    level: any = 0;

    constructor() {
    }

    ngOnInit() {
        this.menuList = this.iteratePristineMenu(this.menuList);

        setTimeout(() => {
            const link = document.querySelectorAll('a[link="true"]');

            for (let i = 0; i < link.length; i++) {
                link[i].addEventListener('click', () => {
                    this.menuClick.emit(false);
                });
            }
        }, 300);
    }

    iteratePristineMenu(allItems: any): any {
        [].slice.call(allItems).sort((a: any, b: any) => {
            if (a.nomeOpcao < b.nomeOpcao) {
                return -1;
            }
            if (a.nomeOpcao > b.nomeOpcao) {
                return 1;
            }
            return 0;
        });

        let remainingList: any = [],
            newMenu = allItems.filter((item: any) => {
                item.idOpcaoMae !== null && remainingList.push(item);
                return item.idOpcaoMae === null;
            });
        return this.iterateOptionsMenu(newMenu, remainingList)[0];
    }

    private iterateOptionsMenu(list: any, fullList: any) {
        let remainingList: any;
        for (let i = 0; i < list.length; i++) {
            remainingList = [];
            let target = list[i],
                subMenus = fullList.filter((item: any) => {
                    item.idOpcaoMae !== target.idOpcao && remainingList.push(item);
                    return item.idOpcaoMae === target.idOpcao;
                });
            if (subMenus.length) {
                target.opcoesFilhas = subMenus;
                remainingList = this.iterateOptionsMenu(target.opcoesFilhas, remainingList)[1];
            }
        }
        return [list, remainingList];
    }
}