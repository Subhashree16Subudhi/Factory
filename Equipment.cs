// Models/Equipment.cs
public class Equipment
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public float Temperature { get; set; }
    public float Vibration { get; set; }
    public int Lifeline { get; set; }
    public int MaxRepairs { get; set; }
    public int RepairsDone { get; set; }
    public float SafeTemp { get; set; }
    public float SafeVib { get; set; }
    public bool NeedsMaintenance { get; set; }
    public string? EfficiencyDependsOn { get; set; }
    public string? History { get; set; }
}
