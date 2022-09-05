package com.turulin.models;

import lombok.Data;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;

@Entity
@Table(name = "contacts")
@Data
public class Contact {
    @Id
    @SequenceGenerator(name = "contacts_gen",
            sequenceName = "contacts_id_gen",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "contacts_gen")
    private long id;
    private String owner;
    private String phone;
    private String date;

    public Contact() {
    }

    public Contact(long id, String owner, String phone) {
        this.id = id;
        this.owner = owner;
        this.phone = phone;
        this.date = new SimpleDateFormat("dd-MM-yyyy HH:mm").format(new Date());
    }

    public Contact(String name, String phone) {
        this.owner = name;
        this.phone = phone;
        this.date = new SimpleDateFormat("dd-MM-yyyy HH:mm").format(new Date());
    }

    @Override
    public String toString() {
        return "Contact{" +
                "id=" + id +
                ", name='" + owner + '\'' +
                ", phone='" + phone + '\'' +
                ", date='" + date + '\'' +
                '}';
    }
}
