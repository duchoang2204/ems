// Simple EventBus → in-memory publish/subscriber
// Hiện tại để demo AuditEvent → sau có thể chuyển sang Kafka / RabbitMQ nếu muốn.

import { singleton } from 'tsyringe';

@singleton()
export class EventBus {
  publish(event: any): void {
    // Tạm thời log ra console → sau này có thể push vào MQ / Kafka / LogService
    console.log('Event published:', event);
  }
}
