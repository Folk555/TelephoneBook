package com.turulin.controllers;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONReader;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.turulin.models.Contact;
import com.turulin.repository.ContactRepository;
import lombok.var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.*;


@Controller
@RequestMapping
public class mainController {
    @Autowired
    ContactRepository contactRepository;

    @GetMapping
    public String show() {
        return "index.html";
    }

    @GetMapping(path = "/telephones", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String showPhoneBook() {
        Iterator<Contact> iterator = contactRepository.findAllByOrderByIdAsc().iterator();
        ArrayList<Contact> contacts = new ArrayList<>();
        while (iterator.hasNext())
            contacts.add(iterator.next());
        return JSON.toJSONString(contacts);
    }

    @PostMapping(path = "/telephones/ajax/update", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String update(@RequestBody String data) throws JsonProcessingException {
        Map<String, String> mapContact =
                new ObjectMapper().readValue(data, HashMap.class);
        long id = Long.parseLong(mapContact.get("id"));
        String newOwner = mapContact.get("owner");
        String newPhone = mapContact.get("phone");
        if (!contactRepository.existsById(id))
            return HttpStatus.CONFLICT.toString();
        Contact newContact = new Contact(id, newOwner, newPhone);
        contactRepository.save(newContact);
        return JSON.toJSONString(newContact);
    }

    @PostMapping(path = "/telephones/ajax/delete", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public void delete(@RequestBody String data) throws JsonProcessingException {
        Map<String, String> mapContact =
                new ObjectMapper().readValue(data, HashMap.class);
        contactRepository.deleteById(Long.parseLong(mapContact.get("id")));

    }

    @PostMapping(path = "/telephones/ajax/create", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String create(@RequestBody String data) throws JsonProcessingException {
        Map<String, String> mapContact =
                new ObjectMapper().readValue(data, HashMap.class);
        String newOwner = mapContact.get("owner");
        String newPhone = mapContact.get("phone");
        Contact newContact = new Contact(newOwner, newPhone);
        newContact = contactRepository.save(newContact);
        if (!contactRepository.existsById(newContact.getId()))
            return HttpStatus.CONFLICT.toString();
        return JSON.toJSONString(newContact);
    }

    @GetMapping(path = "/telephones/ajax/{contactId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getContactByID(@PathVariable long contactId) {
        if (!contactRepository.existsById(contactId))
            return HttpStatus.CONFLICT.toString();
        Contact contact = contactRepository.findById(contactId).get();
        return JSON.toJSONString(contact);
    }

}
