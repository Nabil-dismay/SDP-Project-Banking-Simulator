//account.java
//MUST BE SPLIT INTO SEPARATE FILES!!! 1 class/file

package com.yourapp.bank.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private double balance;

    private String status; // ACTIVE, CLOSED

    private LocalDateTime closedAt;

    // Constructors
    public Account() {}

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }
}

//accountRepository.java
package com.yourapp.bank.repository;

import com.yourapp.bank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {
}

//ResourceNotFoundException.java
package com.yourapp.bank.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

//BadRequestException.java
package com.yourapp.bank.exception;

public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}

//GlobalExceptionHandler.java
package com.yourapp.bank.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequest(BadRequestException ex) {
        return buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(Exception ex) {
        return buildResponse("Internal Server Error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<?> buildResponse(String message, HttpStatus status) {
        return new ResponseEntity<>(
                Map.of(
                        "timestamp", LocalDateTime.now(),
                        "status", status.value(),
                        "error", message
                ),
                status
        );
    }
}

//AccountService.java
package com.yourapp.bank.service;

import com.yourapp.bank.exception.BadRequestException;
import com.yourapp.bank.exception.ResourceNotFoundException;
import com.yourapp.bank.model.Account;
import com.yourapp.bank.repository.AccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Transactional
    public void removeAccount(Long userId, Long accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found"));

        // Ownership check
        if (!account.getUserId().equals(userId)) {
            throw new BadRequestException("Unauthorized action");
        }

        if ("CLOSED".equals(account.getStatus())) {
            throw new BadRequestException("Account already closed");
        }

        // Balance check
        if (account.getBalance() != 0) {
            throw new BadRequestException("Account balance must be zero");
        }

        // Soft delete
        account.setStatus("CLOSED");
        account.setClosedAt(LocalDateTime.now());

        accountRepository.save(account);
    }
}

//AccountController.java
package com.yourapp.bank.controller;

import com.yourapp.bank.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

        import java.util.Map;

@RestController
@RequestMapping("/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(
            @PathVariable Long id,
            @RequestParam Long userId) {

        accountService.removeAccount(userId, id);

        return ResponseEntity.ok(
                Map.of("message", "Account successfully closed")
        );
    }
}