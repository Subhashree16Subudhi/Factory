using System;
namespace FactoryBackend.Models
{
    public class Metric
{
    public int Id { get; set; }
    public int EquipmentId { get; set; }
    public Equipment? Equipment { get; set; }
    public float Temperature { get; set; }
    public float Vibration { get; set; }
    public DateTime Timestamp { get; set; }
}
}
