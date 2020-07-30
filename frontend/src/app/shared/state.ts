import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

export class State<T>{
    private readonly _storage = new StorageWrapper();
    protected store: BehaviorSubject<T>;
    private readonly key = this.constructor.name;
    state$: Observable<T>;
    constructor(
        private readonly initialValue: T,
        private readonly userDB: boolean = true
    ) {


        if (this.userDB && !this._storage.has(this.key)) {
            this._storage.add(this.key, JSON.stringify(initialValue));
        }
        if (this.userDB)
            this.store = new BehaviorSubject(this._storage.get(this.key));
        else
            this.store = new BehaviorSubject(initialValue);
        this.state$ = this.store.asObservable();
        this.state$.subscribe((val) => {
            console.log('val changed', val);

        })
    }

    protected setState(state: Partial<T>) {
        if (this.userDB)
            this._storage.update(this.key, JSON.stringify({ ...this.store.value, ...state }))
        this.store.next({ ...this.store.value, ...state })
    }

    getSnapShot() {
        return this.store.getValue();
    }

}

class StorageWrapper {
    constructor() { }

    add(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    update(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    remove(key: string) {
        localStorage.removeItem(key)
    }

    get(key) {
        if (this.has(key))
            return JSON.parse(localStorage.getItem(key))
        return null;
    }

    has(key: string) {
        return localStorage.getItem(key) ?? false;
    }




}