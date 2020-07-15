import { ConnectionBuilder } from './ConnectionBuilder';
import { Subscriber } from './Subscriber';

export class SubscriberBuilder extends ConnectionBuilder<Subscriber> {
    public build() {
        return new Subscriber();
    }
}
