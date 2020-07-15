import { ConnectionBuilder } from './ConnectionBuilder';
import { Publisher } from './Publisher';

export class PublisherBuilder extends ConnectionBuilder<Publisher> {
    public build() {
        return new Publisher();
    }
}
