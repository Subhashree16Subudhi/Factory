using System;

public class MaintenanceLog
{
public int Id { get; set; }
public int EquipmentId { get; set; }
public Equipment? Equipment { get; set; }
public string Description { get; set; } = "";
public DateTime DatePerformed { get; set; }
}